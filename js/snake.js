//author: Pieter Vermeersch
boardHeight=430;
boardWidth=580;
playerX=playerY=0;
appleX=applyY=0;
partSize=10;
snake = [];
startLength = 5;
startX = 10;
startY = 10;

window.onload = (event) =>
{
        canvas = document.getElementById("screen");
        canvas.height = boardHeight;
        canvas.width = boardWidth;
        context = canvas.getContext("2d");
        window.addEventListener("keydown", startGame)
        window.addEventListener("keydown", setDirection)
        instruction = document.getElementById("instruction");
        initializeSnake();
        cleanBoard();
        drawSnake();   
        moveApple();
        drawApple();       
}    


function tick()
{
    if (playerX != 0 || playerY != 0)
    {
        cleanBoard();
        calculateSnake();
        drawSnake();  
        drawApple();  
        checkCollision();   
    }
}

function initializeSnake()
{
    for (i = 0;i<startLength;++i)
    {
        snake.push({x: startX + i * partSize, y: startY});
    }
}

function checkCollision()
{
    head = snake[snake.length - 1];
    if (head.x == appleX && head.y == appleY)
    {
        tail = snake[0];
        snake.unshift({x: tail.x - partSize, y: tail.y})
        moveApple();
    }
}

function moveApple()
{
    appleX = Math.floor(Math.random() * (boardWidth / partSize) + 1) * partSize;
    appleY = Math.floor(Math.random() * (boardHeight / partSize) + 1) * partSize;
}

function drawApple()
{
    context.fillStyle = "red";
    context.fillRect(appleX ,appleY, partSize, partSize);
}

function cleanBoard()
{
    context.fillStyle = "black";
    context.fillRect(0, 0, boardWidth,boardHeight);
}

function calculateSnake()
{
    snake.shift();
    head = snake[snake.length - 1];
    snake.push({x: head.x + (partSize * playerX), y: head.y + (partSize * playerY)})
}

function drawSnake()
{ 
    for(i=0;i < snake.length;++i)
    {
        var part = snake[i];
        context.fillStyle = "lime";
        context.fillRect(part.x, part.y, partSize, partSize);
        context.strokeRect(part.x, part.y, partSize, partSize);
    } 
}

function startGame(key)
{
    if (key.keyCode == 37 || key.keyCode == 38 || key.keyCode == 39 || key.keyCode == 40)
    {
        setInterval(tick, 1000/15);
        window.removeEventListener("keydown", startGame)
        instruction.classList.remove("blink");
        instruction.innerText = "Press spacebar to pause";
    }
}

function setDirection(key)
{
    if([32, 37, 38, 39, 40].indexOf(key.keyCode) > -1) {
        instruction.innerText = "Press spacebar to pause";
        key.preventDefault();
    }

    if (key.keyCode == 37 && playerX == 0) // left
    {
        playerX = -1;
        playerY = 0;
    }

    if (key.keyCode == 38 && playerY == 0) // up
    {
        playerX = 0;
        playerY = -1;
    }

    if (key.keyCode == 39 && playerX == 0) // right
    {
        playerX = 1;
        playerY = 0;
    }

    if (key.keyCode == 40 && playerY == 0) // down
    {
        playerX = 0;
        playerY = 1;
    }

    if (key.keyCode == 32) // pause
    {
        playerX = 0;
        playerY = 0;
        instruction.innerText = "Press any arrow key to continue";
    }
}