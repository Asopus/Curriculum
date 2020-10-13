//author: Pieter Vermeersch
boardHeight=350;
boardWidth=460;
appleBoundaryY=320;
appleBoundaryX=440;
playerX=playerY=0;
appleX=applyY=0;
partSize=10;
snake = [];
startLength = 3;
startX = 230;
startY = 170;

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
        draw();   
        moveApple();
}    


function tick()
{
    if (playerX != 0 || playerY != 0)
    {
        cleanBoard();
        calculateSnake();
        draw();  
        drawApple();  
        checkAppleCollision();   
    }
}

function initializeSnake()
{
    for (i = 0;i<startLength;++i)
    {
        snake.push({x: startX + i * partSize, y: startY});
    }
}

function checkAppleCollision()
{
    head = snake[snake.length - 1];
    if (head.x == appleX && head.y == appleY)
    {
        tail = snake[0];
        snake.unshift({x: tail.x - partSize, y: tail.y})
        moveApple();
    }
}

function checkBodyCollision(part)
{
    head = snake[snake.length - 1];
    
    if (part != head && head.x  == part.x && head.y == part.y) 
    { 
        snake.splice(0, snake.length - startLength);
    }
}

function draw()
{ 
    for(i=0;i < snake.length;++i)
    {
        var part = snake[i];
        drawPart(part);
        checkBorderCollision(part);
        checkBodyCollision(part);
    } 
}

function drawPart(part)
{
    context.fillStyle = "lime";
    context.fillRect(part.x, part.y, partSize, partSize);
    context.strokeRect(part.x, part.y, partSize, partSize);
}

function checkBorderCollision(part)
{
    if (playerY == 0)
    {
        if (part.x == boardWidth)
        {
            part.x = 0;
        }
        else if (part.x == 0 - partSize)
        {
            part.x = boardWidth - partSize;
        }
    }
    else if (playerX == 0)
    {
        if (part.y == boardHeight)
        {
            part.y = 0;
        }
        else if (part.y == 0 - partSize)
        {
            part.y = boardHeight - partSize;
        }   
    }
}

function moveApple()
{
    appleX = Math.floor(Math.random() * (appleBoundaryX / partSize) + 1) * partSize;
    appleY = Math.floor(Math.random() * (appleBoundaryY / partSize) + 1) * partSize;

    for(i=0;i < snake.length;++i)
    {
        currentPart = snake[i];
        if (currentPart.x == appleX && currentPart.y == appleY)
        { 
            moveApple()
            break;
        }
    }
}

function drawApple()
{
    context.fillStyle = "red";
    context.fillRect(appleX ,appleY, partSize, partSize);
}

function cleanBoard()
{
    context.fillStyle = "black";
    context.fillRect(0, 0, boardWidth, boardHeight);
}

function calculateSnake()
{
    snake.shift();
    head = snake[snake.length - 1];
    snake.push({x: head.x + (partSize * playerX), y: head.y + (partSize * playerY)})
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