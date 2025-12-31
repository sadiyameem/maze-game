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

    //Borders Bounds
    const walls = [
        Bodies.rectangle(width/2, 0, width, 2, {isStatic: true, label: 'border'}),
        Bodies.rectangle(width/2, height, width, 2, {isStatic: true, label: 'border'}),
        Bodies.rectangle(0, height/2, 2, height, {isStatic: true, label: 'border'}),
        Bodies.rectangle(width, height/2, 2, height, {isStaic: true, label: 'border'})
    ];
    World.add(world, walls);

    //Generating Maze
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

    //walls
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
}