const CELL_SIZE = 30;
const MAZE_SIZE = 15;
let player = { x: 0, y: 0 };
let timer;
let timeLeft = 30;
let maze;
let exitPos;
let gameActive = false;

function generatorMaze () {
    maze = Array(MAZE_SIZE)
        .fill()
        .map(() =>
        Array(MAZE_SIZE)
            .fill()
            .map(() => ({
                walls: { top: true, right: true, bottom: true, left: true},
                visited: false,
            }))
        );

    let stack = [];
    let current = { x: 0, y: 0};
    maze[0][0].visited = true;

    while (true) {
        let neighbors = [];
        if (current.x > 0 && !maze[current.x - 1].visited)
            neighbors.push("left");
        if (current.x < MAZE_SIZE - 1 && !maze[current.y][current.x + 1].visited)
            neighbors.push("right");
        if (current.x > 0 && !maze[current.y - 1][current.x].visited)
            neighbors.push("top");
        if (current.x < MAZE_SIZE - 1 && !maze[current.y + 1][current.x].visited)
            neighbors.push("bottom");

        if (neighbors.length > 0) {
            let direction = neighbors[Math.floor(Math.random() * neighbors.length)];
            let next = { x: current.x, y: current.y };

            switch (direction) {
                case "left":
                    maze[current.y][current.x].walls.left = false;
                    maze[current.y][current.x - 1].walls.right = false;
                    next.x--;
                    break;
                case "right":
                    maze[current.y][current.x].walls.right = false;
                    maze[current.y][current.x + 1].walls.left = false;
                    next.x++;
                    break;
                case "top":
                    maze[current.y][current.x].walls.top = false;
                    maze[current.y - 1][current.x].walls.bottom = false;
                    next.y--;
                    break;
                case "bottom":
                    maze[current.y][current.x].walls.bottom = false;
                    maze[current.y + 1][current.x].walls.top = false;
                    next.y++;
                    break;
            }

            maze[next.y][next.x].visited = true;
            stack.push(current);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break;
        }
    }

    let side, exitX, exitY;
    do {
        side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0:
                exitY = 0;
                exitX = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 1:
                exitX = MAZE_SIZE - 1;
                exitY = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 2:
                exitY = MAZE_SIZE - 1;
                exitX = Math.floor(Math.random() * MAZE_SIZE);
                break;
            case 3:
                exitX = 0;
                exitY = Math.floor(Math.random() * MAZE_SIZE);
                break;
        }
    } while (exitX === 0 && exitY === 0);

    exitPos = { x: exitX, y: exitY };

    switch (side) {
        case 0:
            maze[exitY][exitX].walls.top = false;
            break;
        case 1:
            maze[exitY][exitX].walls.right = false;
            break;
        case 2:
            maze[exitY][exitX].walls.bottom = false;
            break;
        case 3:
            maze[exitY][exitX].walls.left = false;
            break;
    }
}

function renderMaze() {
    const container = document.getElementById("maze");
    container.style.gridTemplateColumns = `repeat($(MAZE_SIZE), ${CELL_SIZE}px)`;
    container.innerHTML = "";

    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cell = document.createElement("div");
            cell.className = "cell" + (x === exitPos.x && y === exitPos.y ? " exit": "");
            cell.style.width = CELL_SIZE + "px";
            cell.style.height = CELL_SIZE + "px";

            Object.entries(maze[y][y].walls).forEach(([dir, exists]) => {
                if (exists) {
                    const wall = document.createElement("div");
                    wall.className = `wall ${dir}`;
                    cell.appendChild(wall);
                }
            });
            
            container.appendChild(cell);
        }
    }

    updatePlayerPosition();
}

function updatePlayerPosition() {
    const playerElem = document.getElementById("player");
    playerElem.style.width = CELL_SIZE * 0.6 + "px";
    playerElem.style.height = CELL_SIZE * 0.6 + "px";
    playerElem.style.left = player.x * CELL_SIZE + CELL_SIZE * 0.2 + "px";
    playerElem.style.top = player.y * CELL_SIZE + CELL_SIZE * 0.2 + "px";

    if (player.x === exitPos.x && player.y === exitPos.y) {
        showMessage("winner!");
    }
}

function movePlayer(direction) {
    if (!gameActive) return;
    const walls = maze[player.y][player.x].walls;
    switch (direction) {
        case "up":
            if (!walls.bottom) player.y--;
            break;
        case "down":
            if (!walls.bottom) player.y++;
            break;
        case "left":
            if (!walls.left) player.x--;
            break;
        case "right":
            if (walls.right) player.x++;
            break;
    }
    updatePlayerPosition();
}

function showMessage() {
    gameActive = false;
    clearInterval(timer);
    document.getElementById("message-text").textContent = text;
    document.getElementById("message").style.display = "block";
}

function initGame() {
    gameActive = true;
    timeLeft = 30;
    document.getElementById("timer").textContent = `Timer: ${timeLeft}`;
    document.getElementById("message").style.display = "none";
    player = { x: 0, y: 0};
    generatorMaze();
    renderMaze();

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            showMessage("Time Up!");
        }
    }, 1000);
}

document.addEventListener("keydown", (e) => {
    const directions = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
    };
    if (directions[e.key] && gameActive) {
        movePlayer(directions[e.key]);
        const buttonId = directions[e.key];
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add("hover-effect");
        }
    }
});

document.addEventListener("keydown", (e) => {
    const directions = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
    };
    if (directions[e.key] && gameActive) {
        movePlayer(directions[e.key]);
        const buttonId = directions[e.key];
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add("hover-effect");
        }
    }
});

initGame();