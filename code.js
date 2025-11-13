let gameContainer = document.querySelector(".game-container");
let scoreContainer = document.querySelector(".score-container");
let menuContainer = document.querySelector(".menu-container");

let easyButton = document.querySelector(".easy");
let intermediateButton = document.querySelector(".intermediate");
let hardButton = document.querySelector(".hard");
let extremeButton = document.querySelector(".extreme");
let impossibleButton = document.querySelector(".impossible");

let spawnX, spawnY;
let headX = null,
  headY = headX;
let directionX = 0,
  directionY = 0;
let snakeBody = [];
let score = 0;

//Opens menuscreen on first load
gameContainer.classList.add("hidden");
menuContainer.classList.remove("hidden");

function spawnFood() {
  /** Math.floor to set random number to a whole number rounded down. Indexing at 0 hence +1 */
  spawnX = Math.floor(Math.random() * 20) + 1;
  spawnY = Math.floor(Math.random() * 18) + 1;

  /** Loops through spawning places making sure there isn't a part of the snake
        and then spawns in a different location if there is a part of the snake there */
  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeBody[i][1] == spawnY && snakeBody[i][0] == spawnX) {
      spawnFood();
    }
  }
}

function start() {
  headX = 5;
  headY = 9;
  spawnX = 16;
  spawnY = 9;
  snakeBody = [
    [5, 9],
    [4, 9],
    [3, 9],
  ];

  gameContainer.classList.remove("hidden");
  menuContainer.classList.add("hidden");
}

function gameOver() {
  gameStarted = false;
  directionX = 0;
  directionY = 0;
  snakeBody = [];
  score = 0;
  scoreContainer.innerHTML = "Press any button to start snaking!";
  audio.pause();
  audio.currentTime = 0;

  //Game over sound effect
  let audioGameOver = new Audio("audio/game_over.mp3");
  audioGameOver.play();

  setTimeout(() => {
    alert("Game Over!");
    gameContainer.innerHTML = '<div class="game-container">';
    gameContainer.classList.add("hidden");
    menuContainer.classList.remove("hidden");
  }, 200);
}

/** Food random generating on load/refresh using change of CSS style.
    Grid size is X-Axis = 20 * Y-Axis = 18 */
function renderGame() {
  if (!gameStarted) return;
  let updatedGame = `<div class="food" style="grid-area: ${spawnY}/${spawnX};"></div>`;
  if (spawnX == headX && spawnY == headY) {
    snakeBody.push([spawnY, spawnX]);
    spawnFood();
    score += 1;
    scoreContainer.innerHTML = "Score: " + score;

    //Eating sound effect
    let audioEat = new Audio("audio/eatingfood.mp3");
    audioEat.play();
  }

  headX += directionX;
  headY += directionY;

  snakeBody.pop();

  snakeBody.unshift([headX, headY]);

  /** Checks for border collision */
  if (headX == 0 || headY == 0 || headX == 20 + 1 || headY == 18 + 1) {
    gameOver();
    return;
  }

  /** Checks for collision on snake body */
  for (let i = 1; i < snakeBody.length; i++) {
    if (
      snakeBody[0][0] == snakeBody[i][0] &&
      snakeBody[0][1] == snakeBody[i][1]
    ) {
      gameOver();
      return;
    }
  }

  /** Adds to the lenght of the snake's array */
  for (let i = 0; i < snakeBody.length; i++) {
    if (i == 0) {
      updatedGame += `<div class="snake-head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]};"></div>`;
    } else {
      updatedGame += `<div class="snake" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]};"></div>`;
    }
  }

  gameContainer.innerHTML = updatedGame;
}

spawnFood();

//Background music for the game
let audio = new Audio("audio/background-music.mp3");
audio.loop = true;
audio.volume = 0.25;
let gameStarted = false;

document.addEventListener("keydown", function (e) {
  if (
    !gameStarted &&
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "w",
      "a",
      "s",
      "d",
    ].includes(e.key)
  ) {
    gameStarted = true;
    start();
    audio.play();
  }

  scoreContainer.innerHTML = "Score: " + score;
  let key = e.key;
  if ((key == "ArrowUp" || key == "w") && directionY != 1) {
    directionX = 0;
    directionY = -1;
  } else if ((key == "ArrowLeft" || key == "a") && directionX != 1) {
    directionX = -1;
    directionY = 0;
  } else if ((key == "ArrowDown" || key == "s") && directionY != -1) {
    directionX = 0;
    directionY = 1;
  } else if ((key == "ArrowRight" || key == "d") && directionX != -1) {
    directionX = 1;
    directionY = 0;
  }
});

/* Difficulty buttons setting different game speeds */

let gameInterval = null;
let previousButton = null;

function buttonPressedStyle(button) {
  if (previousButton != null) {
    previousButton.setAttribute("style", "");
  }
  previousButton = button;
  button.setAttribute("style", "background-color: red; border-color: darkred;");
}

easyButton.addEventListener("click", () => {
  if (gameInterval != null) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(renderGame, 200);
  buttonPressedStyle(easyButton);
});

intermediateButton.addEventListener("click", () => {
  if (gameInterval != null) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(renderGame, 150);
  buttonPressedStyle(intermediateButton);
});

hardButton.addEventListener("click", () => {
  if (gameInterval != null) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(renderGame, 125);
  buttonPressedStyle(hardButton);
});

extremeButton.addEventListener("click", () => {
  if (gameInterval != null) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(renderGame, 75);
  buttonPressedStyle(extremeButton);
});

impossibleButton.addEventListener("click", () => {
  if (gameInterval != null) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(renderGame, 50);
  buttonPressedStyle(impossibleButton);
});
