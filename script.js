// Variables to store DOM elements
var bar1 = document.getElementById("bar-1");
var bar2 = document.getElementById("bar-2");
var ball = document.getElementById("ball");

// Movement and speed variables
let whichBar;
var movement = 20;
var moveX = 2;
var moveY = 2;
var ballMoving;
var border = 12;

// Score and high score variables
var score;
var highScore;

// Game-related variables
var gameStart = false;

// Local storage key names
const thisBar1 = "Bar-1";
const thisBar2 = "Bar-2";
const storeName = "abc";
const storeScore = 123;

// Function to initialize the game
(function () {
  // Retrieving high score and winning bar from local storage
  highScore = localStorage.getItem(storeScore);
  whichBar = localStorage.getItem(storeName);

  if (whichBar === "null" || highScore === "null") {
    alert("Hello.. This is your first game");
    highScore = 0;
    whichBar = thisBar1;
  } else {
    alert(whichBar + " has maximum score of " + highScore * 100);
  }

  // Resetting the game based on the winning bar
  gameReset(whichBar);
})();

// Function to reset the game
function gameReset(barName) {
  // Positioning the elements
  bar1.style.left = (window.innerWidth - bar1.offsetWidth) / 2 + "px";
  bar2.style.left = (window.innerWidth - bar2.offsetWidth) / 2 + "px";
  ball.style.left = (window.innerWidth - ball.offsetWidth) / 2 + "px";

  if (barName === thisBar1) {
    ball.style.top =
      bar2.getBoundingClientRect().y -
      bar2.getBoundingClientRect().height +
      "px";
    moveY = -2;
  } else if (barName === thisBar2) {
    ball.style.top = bar1.getBoundingClientRect().height + "px";
    moveY = 2;
  }

  // Resetting score and game status
  score = 0;
  gameStart = false;
}

// Event listener for keydown events
document.addEventListener("keydown", function (event) {
  // Moving the bars using arrow keys or 'A' and 'D' keys
  if (event.keyCode == 68 || event.keyCode == 39) {
    if (
      parseInt(bar1.style.left) <
      window.innerWidth - bar1.offsetWidth - border
    ) {
      bar1.style.left = parseInt(bar1.style.left) + movement + "px";
      bar2.style.left = bar1.style.left;
    }
  }
  if (event.keyCode == 65 || event.keyCode == 37) {
    if (parseInt(bar1.style.left) > border) {
      bar1.style.left = parseInt(bar1.style.left) - movement + "px";
      bar2.style.left = bar1.style.left;
    }
  }
  // Starting the game with the Enter key
  if (event.keyCode == 13) {
    if (!gameStart) {
      gameStart = true;

      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;
      let bar1Height = bar1.offsetHeight;
      let bar2Height = bar2.offsetHeight;
      let bar1Width = bar2.offsetWidth;
      let bar2Width = bar2.offsetWidth;

      // Moving the ball at regular intervals
      ballMoving = setInterval(function () {
        let bar1X = bar1.getBoundingClientRect().x;
        let bar2X = bar2.getBoundingClientRect().x;
        let ballCentre = ballX + ballDia / 2;

        ballX += moveX;
        ballY += moveY;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        // Bounce the ball off the walls
        if (
          ballX + ballDia > window.innerWidth ||
          ballX < 0
        ) {
          moveX = -moveX;
        }

        // Collision detection with the top bar
        if (ballY <= bar1Height) {
          moveY = -moveY;
          score++;

          // Checking if the ball goes past the bar
          if (
            ballCentre < bar1X ||
            ballCentre > bar1X + bar1Width
          ) {
            dataStoring(score, thisBar2);
          }
        }

        // Collision detection with the bottom bar
        if (ballY + ballDia >= window.innerHeight - bar2Height) {
          moveY = -moveY;
          score++;

          // Checking if the ball goes past the bar
          if (
            ballCentre < bar2X ||
            ballCentre > bar2X + bar2Width
          ) {
            dataStoring(score, thisBar1);
          }
        }
      }, 10);
    }
  }
});

// Function to store data and handle game over
function dataStoring(scoreObtained, winningBar) {
  // Updating high score and winning bar in local storage
  if (score > highScore) {
    highScore = score;
    localStorage.setItem(storeName, winningBar);
    localStorage.setItem(storeScore, highScore);
  }

  // Clearing the ball movement interval
  clearInterval(ballMoving);

  // Resetting the game
  gameReset(winningBar);

  // Displaying the game over message
  alert(
    winningBar +
      " wins with a score of " +
      scoreObtained * 100 +
      ". Max Score is: " +
      highScore * 100
  );
}
