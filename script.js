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
}