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
hasDrawn = true;
allCompetences = [];
numbers = ["one","two","three","four","five"];
skillLevels = ["Novice", "Elementary", "Intermediate", "Advanced", "Expert"];
gameStarted = false;

window.onload = (event) =>
{
        canvas = document.getElementById("screen"); 
        canvas.height = boardHeight;
        canvas.width = boardWidth;
        context = canvas.getContext("2d");
        window.addEventListener("keydown", startGame)
        window.addEventListener("keydown", setDirection)
        instruction = document.getElementById("instruction");
        initializeModalFocus();
        readCompetences();
        initializeSnake();
        cleanBoard();
        draw();   
        moveApple();
}    

function initializeModalFocus()
{
    $('#competenceModal').keydown(function(e) {
        if (e.keyCode === 37) {
           // Previous
           $(".carousel-control-prev-icon").click();
           return false;
        }
        if (e.keyCode === 39) {
           // Next
           $(".carousel-control-next-icon").click();
           return false;
        }
    });
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
        hasDrawn = true;
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
        spawnCompetence();
    }
}

function spawnCompetence()
{
    score = document.getElementById("score");
    oldScore = parseInt(score.innerText);
    if(oldScore != allCompetences.length)
    {
        currentCompetence = allCompetences[oldScore];
        score.innerText = oldScore + 1;
        competences = document.getElementById("competences");
        competence =  document.createElement("div");
        competence.classList.add("competence");
        competence.classList.add("animate__animated");
        competence.classList.add("animate__swing");
        competence.classList.add("animate__slow");
        competence.setAttribute('data-target', "#competenceCarousel");
        competence.setAttribute('data-slide-to', oldScore);        
        competenceTitle = document.createElement("span");
        competenceTitle.innerHTML = currentCompetence.title;
        competence.appendChild(competenceTitle);
        competences.appendChild(competence);
        
        carousel = document.getElementById("innerCarousel");

        carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");

        if (oldScore == 0)
        {
            carouselItem.classList.add("active");
        }

        technologyHeader = document.createElement("div");
        technologyHeader.classList.add("row");
        technologyHeader.classList.add("competence-technologies");
        technologyHeader.classList.add("header");
        headerName = document.createElement("div");
        headerName.classList.add("col");
        headerName.classList.add("competence-header-name");
        headerName.innerText= currentCompetence.title;

        technologyHeader.appendChild(headerName);

        for (i=0;i<numbers.length;++i)
        {
            titleElement = document.createElement("div");
            titleElement.classList.add("col");
            titleElement.classList.add(numbers[i]);
            titleElement.innerText= skillLevels[i];
            technologyHeader.appendChild(titleElement);
        }
        
        carouselItem.appendChild(technologyHeader);

        for (i=0;i<currentCompetence.technologies.length;++i)
        {
            currentTechnology = currentCompetence.technologies[i];

            technologies = document.createElement("div");
            technologies.classList.add("row");
            technologies.classList.add("competence-technologies");
            nameElement = document.createElement("div");
            nameElement.classList.add("name");
            nameElement.classList.add("col");
            namespan = document.createElement("span");
            namespan.innerText = currentTechnology.title;
            nameElement.appendChild(namespan);
            technologies.appendChild(nameElement);

            for (j=0;j<currentTechnology.rating;++j)
            {
                imgContainer = document.createElement("div");
                imgContainer.classList.add(numbers[j]);
                imgContainer.classList.add("col");
                imgElement = document.createElement("img");
                imgElement.width = 25;
                imgElement.height = 30;
                imgElement.src = "../../assets/img/apple.png";
                imgContainer.appendChild(imgElement);
                technologies.appendChild(imgContainer);
            }

            carouselItem.appendChild(technologies);
        }

        carousel.appendChild(carouselItem);
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
    if([37, 38, 39, 40].indexOf(key.keyCode) > -1) 
    {
        setInterval(tick, 1000/15);
        window.removeEventListener("keydown", startGame)
        instruction.classList.remove("blink");
        instruction.innerText = "Press spacebar to pause";
        basket = document.getElementById("apple-basket");
        basket.classList.remove("invisible");
        basket.classList.add("animate__animated");
        basket.classList.add("animate__bounceInLeft");
        gameStarted = true;
    }
}

function setDirection(key)
{    
    if (gameStarted)
    {
        if([32, 37, 38, 39, 40].indexOf(key.keyCode) > -1) 
        {
            instruction.innerText = "Press spacebar to pause";
            key.preventDefault();
        }   

        if (hasDrawn)
        {
            if (key.keyCode == 37 && playerX == 0) // left
            {hasDrawn = false;
                playerX = -1;
                playerY = 0;
            } else if (key.keyCode == 38 && playerY == 0) // up
            {
                hasDrawn = false;
                playerX = 0;
                playerY = -1;
            } else if (key.keyCode == 39 && playerX == 0) // right
            {
                hasDrawn = false;
                playerX = 1;
                playerY = 0;
            } else if (key.keyCode == 40 && playerY == 0) // down
            {
                hasDrawn = false;
                playerX = 0;
                playerY = 1;
            }
        }

        if (key.keyCode == 32) // space
        {
            playerX = 0;
            playerY = 0;
            instruction.innerText = "Press any arrow key to continue";
        }
    }
}

function readCompetences()
{
    $.ajax({
        url: "../../assets/competences/competences.json",
        type: "GET",
        success: function (response) {
            allCompetences = response;
            totalToCollect = document.getElementById("toCollect").innerText = "\xA0/ " + allCompetences.length;
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
}