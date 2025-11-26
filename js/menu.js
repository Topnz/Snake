let easyButton = document.querySelector(".easy");
let intermediateButton = document.querySelector(".intermediate");
let hardButton = document.querySelector(".hard");
let extremeButton = document.querySelector(".extreme");
let impossibleButton = document.querySelector(".impossible");

let highscoreElement = document.querySelector("#highscore");

let highscore = localStorage.getItem("highscore");
if (highscore === null) {
  highscore = 0;
}
highscoreElement.textContent = "Highscore: " + highscore;

//Opens menuscreen on first load
gameContainer.classList.add("hidden");
menuContainer.classList.remove("hidden");

/* Difficulty buttons setting different game speeds */

let gameInterval = null;
let previousButton = null;

let difficultyStorage = localStorage.getItem("difficulty");
if (difficultyStorage === null) {
  difficultyStorage = "easy";
}
buttonClicked(difficultyStorage);

function buttonPressedStyle(button) {
  if (previousButton != null) {
    previousButton.classList.remove("pressed");
  }
  button.classList.add("pressed");
  previousButton = button;
}

function buttonClicked(event) {
  if (gameInterval != null) {
    clearInterval(gameInterval);
  }

  let difficulty = null;
  if (event.target === null) {
    difficulty = difficultyStorage;
  } else difficulty = event.target.classList[0];

  switch (difficulty) {
    case "impossible":
      gameInterval = setInterval(renderGame, 50);
      buttonPressedStyle(impossibleButton);
      localStorage.setItem("difficulty", "impossible");
      break;
    case "extreme":
      gameInterval = setInterval(renderGame, 75);
      buttonPressedStyle(extremeButton);
      localStorage.setItem("difficulty", "extreme");
      break;
    case "hard":
      gameInterval = setInterval(renderGame, 125);
      buttonPressedStyle(hardButton);
      localStorage.setItem("difficulty", "hard");
      break;
    case "intermediate":
      gameInterval = setInterval(renderGame, 150);
      buttonPressedStyle(intermediateButton);
      localStorage.setItem("difficulty", "intermediate");
      break;
    default:
      gameInterval = setInterval(renderGame, 200);
      buttonPressedStyle(easyButton);
      localStorage.setItem("difficulty", "easy");
      break;
  }
}

easyButton.addEventListener("click", buttonClicked);
intermediateButton.addEventListener("click", buttonClicked);
hardButton.addEventListener("click", buttonClicked);
extremeButton.addEventListener("click", buttonClicked);
impossibleButton.addEventListener("click", buttonClicked);
