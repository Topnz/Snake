let gameContainer = document.querySelector(".game-container");
let scoreContainer = document.querySelector(".score-container");
let scoreText = document.querySelector(".score-text");
let menuContainer = document.querySelector(".menu-container");

// Difficulty buttons
let easyButton = document.querySelector(".easy");
let intermediateButton = document.querySelector(".intermediate");
let hardButton = document.querySelector(".hard");
let extremeButton = document.querySelector(".extreme");
let impossibleButton = document.querySelector(".impossible");

// UI elements for mute, scoreboard, and pause overlay
let muteBtn = document.querySelector(".mute-btn");
let scoreboardList = document.querySelector(".scoreboard-list");
let pauseOverlay = document.querySelector(".pause-overlay");

// High score data (session only)
let highScores = [];
const MAX_SCORES = 5;

let spawnX, spawnY;
let headX = null,
  headY = headX;
let directionX = 0,
  directionY = 0;
let snakeBody = [];
let score = 0;

//Background music for the game
let audio = new Audio("audio/background-music.mp3");
audio.loop = true;
audio.volume = 0.25;
let gameStarted = false;
let muted = false;
let paused = false;

// prevent scroll on keys
window.addEventListener("keydown", function (e) {
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      " ",
      "w",
      "a",
      "s",
      "d",
    ].includes(e.key)
  ) {
    e.preventDefault();
  }
});

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
    if (snakeBody[i][0] == spawnX && snakeBody[i][1] == spawnY) {
      spawnFood();
      return;
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
  directionX = 1;
  directionY = 0;
  paused = false;
  pauseOverlay.classList.add("hidden");

  gameContainer.classList.remove("hidden");
  menuContainer.classList.add("hidden");
}

function updateScoreboard() {
  scoreboardList.innerHTML = "";

  if (highScores.length === 0) {
    let li = document.createElement("li");
    li.textContent = "No scores yet";
    scoreboardList.appendChild(li);
    return;
  }

  highScores.forEach((s) => {
    let li = document.createElement("li");
    li.textContent = `${s}`;
    scoreboardList.appendChild(li);
  });
}

function gameOver() {
  let finalScore = score;

  if (finalScore > 0) {
    highScores.push(finalScore);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, MAX_SCORES);
    updateScoreboard();
  }

  gameStarted = false;
  paused = false;
  pauseOverlay.classList.add("hidden");

  directionX = 0;
  directionY = 0;
  snakeBody = [];
  score = 0;
  scoreText.textContent = "Press any button to start snaking!";
  audio.pause();
  audio.currentTime = 0;

  //Game over sound effect
  if (!muted) {
    let audioGameOver = new Audio("audio/game_over.mp3");
    let _ = audioGameOver.play();
  }

  setTimeout(() => {
    alert("Game Over!");
    gameContainer.innerHTML = "";
    gameContainer.classList.add("hidden");
    menuContainer.classList.remove("hidden");
  }, 200);
}

/** Food random generating on load/refresh using change of CSS style.
    Grid size is X-Axis = 20 * Y-Axis = 18 */
function renderGame() {
  if (!gameStarted) return;
  if (paused) return; // don't update while paused

  let updatedGame = `<div class="food" style="grid-area: ${spawnY}/${spawnX};"></div>`;

  if (spawnX == headX && spawnY == headY) {
    snakeBody.push([spawnX, spawnY]);
    spawnFood();
    score += 1;
    scoreText.textContent = "Score: " + score;

    //Eating sound effect
    if (!muted) {
      let audioEat = new Audio("audio/eatingfood.mp3");
      let _ = audioEat.play();
    }
  }

  headX += directionX;
  headY += directionY;

  snakeBody.pop();
  snakeBody.unshift([headX, headY]);

  /** Checks for border collision */
  if (headX == 0 || headY == 0 || headX == 21 || headY == 19) {
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
updateScoreboard();

// mute button click
muteBtn.addEventListener("click", () => {
  muted = !muted;
  audio.muted = muted;
  muteBtn.textContent = muted ? "UNMUTE" : "MUTE";
});

// keyboard controls: start + pause + movement + mute
document.addEventListener("keydown", function (e) {
  let key = e.key.toLowerCase();

  // START GAME
  if (
    !gameStarted &&
    [
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "w",
      "a",
      "s",
      "d",
      " ",
    ].includes(key)
  ) {
    gameStarted = true;
    start();
    if (!muted) audio.play();
    scoreText.textContent = "Score: " + score;
    return;
  }

  // mute/unmute
  if (key === "m") {
    muted = !muted;
    audio.muted = muted;
    muteBtn.textContent = muted ? "UNMUTE" : "MUTE";
    return;
  }

  // pause / resume
  if (key === " " && gameStarted) {
    paused = !paused;

    if (paused) {
      audio.pause();
      pauseOverlay.classList.remove("hidden");
      scoreText.textContent = "Game paused - press SPACE to resume";
    } else {
      if (!muted) audio.play();
      pauseOverlay.classList.add("hidden");
      scoreText.textContent = "Score: " + score;
    }
    return;
  }

  // ignore movement while paused
  if (paused) return;

  // movement
  if ((key == "arrowup" || key == "w") && directionY != 1) {
    directionX = 0;
    directionY = -1;
  } else if ((key == "arrowleft" || key == "a") && directionX != 1) {
    directionX = -1;
    directionY = 0;
  } else if ((key == "arrowdown" || key == "s") && directionY != -1) {
    directionX = 0;
    directionY = 1;
  } else if ((key == "arrowright" || key == "d") && directionX != -1) {
    directionX = 1;
    directionY = 0;
  }
});

/* Difficulty buttons setting different game speeds */

let gameInterval = null;
let previousButton = null;

function buttonPressedStyle(button) {
  if (previousButton != null) {
    previousButton.classList.remove("active");
    previousButton.setAttribute("style", "");
  }
  previousButton = button;
  button.classList.add("active");
}

easyButton.addEventListener("click", () => {
  if (gameInterval != null) clearInterval(gameInterval);
  gameInterval = setInterval(renderGame, 200);
  buttonPressedStyle(easyButton);
});

intermediateButton.addEventListener("click", () => {
  if (gameInterval != null) clearInterval(gameInterval);
  gameInterval = setInterval(renderGame, 150);
  buttonPressedStyle(intermediateButton);
});

hardButton.addEventListener("click", () => {
  if (gameInterval != null) clearInterval(gameInterval);
  gameInterval = setInterval(renderGame, 125);
  buttonPressedStyle(hardButton);
});

extremeButton.addEventListener("click", () => {
  if (gameInterval != null) clearInterval(gameInterval);
  gameInterval = setInterval(renderGame, 75);
  buttonPressedStyle(extremeButton);
});

impossibleButton.addEventListener("click", () => {
  if (gameInterval != null) clearInterval(gameInterval);
  gameInterval = setInterval(renderGame, 50);
  buttonPressedStyle(impossibleButton);
});
