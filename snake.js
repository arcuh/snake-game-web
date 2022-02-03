const scoreText = document.getElementById("score");
const gameOver = document.getElementById("game-over");
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.focus();

const size = 480;
canvas.style.width = size + "px";
canvas.style.height = size + "px";

const scale = window.devicePixelRatio;
canvas.width = Math.floor(size * scale);
canvas.height = Math.floor(size * scale);

ctx.scale(scale, scale);

const pixels = 32;
const pixel = size/pixels;

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#000000"
ctx.globalAlpha = 0.4;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.globalAlpha = 1;
ctx.font = "30px Montserrat, sans-serif";
ctx.fillStyle = "#000000";
ctx.textAlign = "center";
ctx.fillText("Press any key to start!", canvas.width/2, canvas.height/2);


let score = 0;
let run = true;

let direction = {
    x: 1,
    y: 0,
};

let moveCounter = 0;
let secInterval = 1000;
let pixelPerSec = 5;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    moveCounter += deltaTime;
    if (moveCounter >= secInterval / pixelPerSec) {
        changeDirection(keyPressed[keyPressed.length - 1]);
        move();
        moveCounter = 0;
        keyPressed = [];
    }

    draw();
    displayScore();
    if (!run) {
        displayGameOver();
        return;
    }
    requestAnimationFrame(update);
}

function updateScore() {
    score += 100;
    pixelPerSec >= pixels ? pixels : pixelPerSec++;
}

function displayScore() {
    scoreText.innerText = "Score: " + score;
}

function displayGameOver() {
    ctx.fillStyle = "#000000"
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.font = "30px Montserrat, sans-serif";
    ctx.fillStyle = "#ff0000";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);

    ctx.font = "20px Montserrat, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Press any key to play again.", canvas.width/2, canvas.height/2 + 30);
    canvas.addEventListener("keydown", start);
    score = 0;
}

function move() {
    var newX = player[0].pos.x + direction.x * pixel;
    var newY = player[0].pos.y + direction.y * pixel;

    if (newX >= canvas.width) newX = 0;
    if (newX < 0) newX = canvas.width;
    if (newY >= canvas.height) newY = 0;
    if (newY < 0) newY = canvas.height;


    const newPos = addPlayerBody(newX, newY);
    
    if (player.filter(body => {return body.pos.x == newX && body.pos.y == newY}).length > 0) {
        run = false;
        return;
    }

        if (newX === apple.pos.x && newY === apple.pos.y) {
        player.unshift(addPlayerBody(apple.pos.x, apple.pos.y));
        apple = getRandomPos();
        while (player.filter(body => {return body.pos.x === apple.pos.x && body.pos.y == apple.pos.y}).length > 0) {
            apple = getRandomPos();
        }
        updateScore(); 
        return;
    }

    player.pop();
    player.unshift(newPos);
}

function draw() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.forEach(playerBody => drawPlayerBody(playerBody.pos));
    drawApple(apple.pos);
}

function drawPlayerBody(pos) {
    ctx.fillStyle = "#32194f";
    ctx.fillRect(pos.x, pos.y, pixel, pixel);
}

function drawApple(pos) {
    ctx.fillStyle = "#f0056f";
    ctx.fillRect(pos.x, pos.y, pixel, pixel);
}
function addPlayerBody(x, y) {
    return {pos: {x: x, y: y}};
}

function getRandomPos() {
    return {
        pos: {
            x: Math.floor(Math.random() * 16) * pixel,
            y: Math.floor(Math.random() * 16) * pixel,
        }
    };
}

let lastKeyPressed = "ArrowRight";
function changeDirection(key) {
    switch (key) {
        case "ArrowLeft":
            if (lastKeyPressed == "ArrowRight" || lastKeyPressed == "ArrowLeft") {
                break;
            }
            direction = {x: -1, y: 0};
            lastKeyPressed = key;
            break;
        case "ArrowUp":
            if (lastKeyPressed == "ArrowDown" || lastKeyPressed == "ArrowUp") {
                break;
            }
            direction = {x: 0, y: -1};
            lastKeyPressed = key;
            break;
        case "ArrowRight":
            if (lastKeyPressed == "ArrowLeft" || lastKeyPressed == "ArrowRight") {
                break;
            }
            direction = {x: 1, y: 0};
            lastKeyPressed = key;
            break;
        case "ArrowDown":
            if (lastKeyPressed == "ArrowUp" || lastKeyPressed == "ArrowDown") {
                break;
            }
            direction = {x: 0, y: 1};
            lastKeyPressed = key;
            break;
    }
}

let keyPressed = [];
canvas.addEventListener("keydown", (event) => {
    keyPressed.push(event.key);
});

var player; 

var apple 

canvas.addEventListener("keydown", start);
function start() {
    player = [
        addPlayerBody(8 * pixel, 7 * pixel),
        addPlayerBody(7 * pixel, 7 * pixel),
        addPlayerBody(6 * pixel, 7 * pixel)
    ];

    apple = getRandomPos();
    while (player.filter(body => {return body.pos.x === apple.pos.x && body.pos.y == apple.pos.y}).length > 0) {
        apple = getRandomPos();
    }

    run = true;
    pixelPerSec = 5;
    update();

    canvas.removeEventListener("keydown", start);
}
