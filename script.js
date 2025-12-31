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
}