let gameContainer = document.querySelector(".game-container")
let scoreContainer = document.querySelector(".score-container")

let spawnX, spawnY;
let headX = Math.floor(Math.random()*(15-5) + 5), headY = headX; /** Random starting position centeralised */
let directionX = 0, directionY = 0;
let snakeBody = [];
let score = 0;


function spawnFood(){
    /** Math.floor to set random number to a whole number rounded down. Indexing at 0 hence +1 */
    spawnX = Math.floor(Math.random()*20) + 1; 
    spawnY = Math.floor(Math.random()*18) + 1; 


    /** Loops through spawning places making sure there isn't a part of the snake
        and then spawns in a different location if there is a part of the snake there */
    for(let i = 0; i<snakeBody.length; i++){
        if(snakeBody[i][1] == spawnY && snakeBody[i][0] == spawnX){
            spawnFood();
        }
    }
}

function gameOver(){
    headX = Math.floor(Math.random()*(15-5) + 5) + 1; /** Random starting position centeralised */
    headY = headX;
    spawnFood();
    directionX = 0;
    directionY = 0;
    snakeBody = [];
    score = 0;
    scoreContainer.innerHTML = "Press any button to start snaking!";
    alert("Game Over!")
}


/** Food random generating on load/refresh using change of CSS style.
    Grid size is X-Axis = 20 * Y-Axis = 18 */
function renderGame(){
    let updatedGame = `<div class="food" style="grid-area: ${spawnY}/${spawnX};"></div>`;
    if(spawnX == headX && spawnY == headY){
        snakeBody.push([spawnY, spawnX]);
        spawnFood();
        score+=1;
        scoreContainer.innerHTML = "Score: " + score;
    }

    headX+=directionX;
    headY+=directionY;

    snakeBody.pop();
    snakeBody.unshift([headX, headY]);

    /** Checks for border collision */
    if(headX == 0 || headY == 0 || headX == 20 + 1 || headY == 18 + 1){
        gameOver();
    }
    
    /** Checks for collision on snake body */
    for(let i=1; i<snakeBody.length; i++){
        if(snakeBody[0][0] == snakeBody[i][0] && snakeBody[0][1] == snakeBody[i][1]){
            gameOver();
        }
    }

    /** Adds to the lenght of the snake's array */
    for(let i=0; i<snakeBody.length; i++){
        updatedGame += `<div class="snake" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]};"></div>`;
    }

    gameContainer.innerHTML = updatedGame;
}  

spawnFood();
setInterval(renderGame,200);

document.addEventListener("keydown",function(e){
    scoreContainer.innerHTML = "Score: " + score;  
    let key = e.key;
    if(key == ("ArrowUp" || key == "w") && directionY != 1){
        directionX = 0;
        directionY = -1;
    }else if(key == ("ArrowLeft" || key == "a") && directionX != 1){
        directionX = -1;
        directionY = 0;
    }else if(key == ("ArrowDown" || key == "s") && directionY != -1){
        directionX = 0;
        directionY = 1;
    }else if(key == ("ArrowRight" || key == "d" && directionX != -1)){
        directionX = 1;
        directionY = 0;
    }
})