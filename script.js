restartGame = () => {
    const { Engine, Render, Runner, World, Bodies, Body, Events} = Matter;

    const cellsHorizontal = 20;
    const cellsVertical = 10;
    const width = window.innerWidth;
    const height = windopw.innerHeight;

    const unitLenghtX = width / cellsHorizontal;
    const unitLenghtY = height / cellsVertical;

    const engine = Engine.create();
    engine.world.gravity.y = 0;
    const { world } = engine;
    const render = Render.create({
        element: document.body,
        engine: engine,
        options:{
            wireframes: false,
            width,
            height
        }
    });
    Render.run(render);
    Runner.run(Runner.create(), engine);

    // Borders Bounds
    const walls = [
        Bodies.rectangle(width/2, 0, width, 2, {isStatic: true, label: 'border'}),
        Bodies.rectangle(width/2, height, width, 2, {isStatic: true, label: 'border'}),
        Bodies.rectangle(0, height/2, 2, height, {isStatic: true, label: 'border'}),
        Bodies.rectangle(width, height/2, 2, height, {isStaic: true, label: 'border'})
    ];
    World.add(world, walls);

    // Generating Maze
    const shuffle = arr => {
        let counter = arr.length;

        while (counter > 0) {
            const index = Math.floor(Math.random() * counter);

            counter--;

            const temp = arr[counter];
            arr[counter] = arr[index];
            arr[index] = temp;
        }
        return arr;
    };
    const grid = Array(cellVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

    // Walls
    const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal -1 ).fill(false));

    const horizontals = Array(cellsVertical).fill(null).map(() => Array(cellHorizontal).fill(false));

    const startRow = Math.floor(Math.random() * cellsVertical);
    const startColumn = Math.floor(Math.random() * cellsHorizontal);

    const stepThroughCell = (row, column) => {
        if (grid[row][column]) {
            return;
        }
        grid[row][column] = true;
        const neighbors = shuffle([
            [row - 1, column, 'up'],
            [row, column + 1, 'right'],
            [row + 1, column, 'down'],
            [row, column - 1, 'left']
        ]);
        for (let neighbor of neighbors) {
            const [nextRow, nextColumn, direction] = neighbor;
            if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
                continue;
            }
            if (gris[nextRow][nextColumn]) {
                continue;
            }
            if (direction === 'left') {
                verticals[row][column -1] = true;
            } else if (direction === 'right') {
                verticals[row][column] = true;
            } else if (direction === 'up') {
                horizontals[row -1][column] = true;
            } else if (direction === 'down') {
                horizontals[row][column] = true;
            }
            stepThroughCell(nextRow, nextColumn);
        }
    };
    stepThroughCell(startRow, startColumn);
    horizontals.forEach((row, rowIndex) => {
        row.forEach((open, columnIndex) => {
            if (open) {
                return;
            }
            const wall = Bodies.rectangle(
                columnIndex * unitLenghtX + unitLenghtX/2,
                rowIndex * unitLenghtX + unitLenghtY,
                unitLenghtX,
                5,
                {
                    friction: 0,
                    label: 'wall',
                    isStatic: true,
                    render: {
                        fillStyle: 'rgb(216,191,216)'
                    }
                }
            );
            World.add(world, wall);
        });
    });
    verticals.forEach((row, rowIndex) => {
        row.forEach((open, columnIndex) => {
            if (open) {
                return;
            }
            const wall = Bodies.rectangle(
                columnIndex * unitLenghtX + unitLenghtX,
                rowIndex * unitLenghtY + unitLenghtY/2,
                5,
                unitLenghtY,
                {
                    friction: 0,
                    label: 'wall',
                    isStatic: true,
                    render: {
                        fillStyle: 'rgb(216,191,216)'
                    }
                }
            );
            World.add(world, wall);
        });
    });

    // Goal
    const goal = Bodies.rectangle(
        width - unitLenghtX/2,
        height - unitLenghtY/2,
        unitLenghtX * .7,
        unitLenghtY * .7,
        {
            label: 'goal',
            isStatic: true,
            render: {
                fillStyle: 'rgb(144,238,144)'
            }
        }
    );
    World.add(world, goal);

    // Ball
    const ballRadius = Math.min(unitLenghtX, unitLenghtY) / 4;
    const ball = Bodies.circle(
        unitLenghtX / 2,
        unitLenghtY / 2,
        ballRadius,
        {
            friction: 0,
            label: 'ball',
                render: {
                    fillStyle: 'rgb(255,140,0)'
                }
        }
    );
    World.add(world, ball);

    const removeInfo = () => {
        document.querySelector('.info').classList.add('hidden');
    }
    document.addEventListener('keydown', event => {
        const {x,y} = ball.velocity;
        removeInfo();
        if (event.keyCode === 87 || event.keyCode === 38) {
            Body.setVelocity(ball, {x,y: y-2});
        }
        if (event.keyCode === 68 || event.keyCode === 39) {
            Body.setVelocity(ball, {x: x + 2, y});
        }
        if (event.keyCode === 83 || event.keyCode === 40) {
            Body.setVelocity(ball, {x,y: y + 2});
        }
        if (event.keyCode === 65 || event.keyCode === 37) {
            Body.setVelocity(ball, {x: x -2,y});
        }
    });

    // Win Condition
    Events.on(engine, 'collisionStart', event => {
        event.pairs.forEach((collision) => {
            const labels = ['ball', 'goal'];

            if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
                document.querySelector('.winner').classList.remove('hidden');
                world.gravity.y = 1;
                world.bodies.forEach(body => {
                    if (body.label === 'wall') {
                        Body.setStatic(body, false);
                    }
                });
            }
        });
    });

    // Restart Game
    document.querySelector('.restart').addEventListener('click', event => {
        event.preventDefault();
        World.clear(world);
        Engine.clear(engine);
        Render.stop(render);
        render.canvas.remove();
        render.canvas = null;
        render.context = null;
        render.textures = {};
        document.querySelector('.winner').classList.ass('hidden');
        document.querySelector('.info').classList.remove('hidden');
        restartGame();
    });
}
restartGame();