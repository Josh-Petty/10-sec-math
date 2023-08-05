/* global variables */
var highScore = 0;
var score = 0;
var result;

/* Timer object decleration */
var Timer = function () {
  var timeRemaining = 10;
  var timer = null;
  $('#timer').html(timeRemaining);

  this.countdown = function () {
    if (!timer) {
      timer = setInterval(function () {
        timeRemaining--;
        $('#timer').html(timeRemaining);
        setTimeout(function () {
          if (timeRemaining === 0) {
            window.clearInterval(timer);
            gameOver();
            timer = null;
          }
        }, 500);
      }, 1000);
    }
    return;
  }

  this.addTime = function (sec) {
    timeRemaining += sec;
    $('#timer').html(timeRemaining);
    return;
  }
}

/* generates a random number */
var randomNum = function (a, b) {
  return _.random(a, b);
}

/* randomly chooses one of the selected operators in the difficulty setting */
var getOperator = function () {
  var getOprOptions = function () {
    var oprs = [['add', '+'], ['subtract', '-'], ['multiply', '*'], ['divide', '/']];
    var result = oprs.filter(function (arg) {
      if ($(`#${arg[0]}`).is(':checked')) {
        return arg;
      }
    });
    
    return result;
  }

  var oprOptions = getOprOptions();
  operator = _.sample(oprOptions, 1);
  return operator[0][1];
}

/* determines the correct answer for the current equation */
var getAnswer = function (num1, num2, operator) {
  if (operator === '+') {
    return num1 + num2;
  } else if (operator === '-') {
    return num1 - num2;
  } else if (operator === '*') {
    return num1 * num2;
  } else {
    return num1 / num2;
  }
}

/* generates a new equation */
var getEquation = function () {
  var num1 = randomNum(1, 20);
  var num2 = randomNum(1, 20);
  var operator = getOperator();


  if ((operator === '-' || operator === '/') && num2 > num1) {
    var temp = num2;
    num2 = num1;
    num1 = temp;
  }

  if (operator === '/') {
    while (num1 % num2 !== 0 || num1 === num2) {
      num1 = randomNum(1, 20);
      num2 = randomNum(1, 20);
      if (num2 > num1) {
        temp = 2;
        num2 = num1;
        num1 = num2;
      }
    }
  }

  var result = getAnswer(num1, num2, operator);
   $('#equation').html(`${num1} ${operator} ${num2}`);
  return result;
}

/* checks the players entered answer compared to the correct result */
var checkAnswer = function (result, answer) {
  if (result === answer) {
    score += 1;
    $('#score').html(score);
    return true;
  }
  return false;
}

/* Game Over */
var gameOver = function () {
  if (score > highScore) {
    highScore = score;
    $('#highscore').html(highScore);
  }

  alert(`Game Over!  You scored ${score}!`);
  alert(`The current High Score is ${highScore}!`);
  var playAgain = confirm('Would you like to play again?');

  if (playAgain) {
    result = getEquation();
    playGame();
    score = 0;
    $('#score').html(score);
  }
}

/* main game loop */
var playGame = function () {
  var timer = new Timer();
  timer.countdown();
    
  window.addEventListener('keyup', function (event) {
    var answer = $('#answerBox').val();
    if ((event.key === 'Enter') && (answer)) {
      if (checkAnswer(result, parseInt(answer)) === true) {
        timer.addTime(1);
      }
      $('#answerBox').val('');
      result = getEquation();
    }
  });
}

/* listens for player input to start the game */
$(document).ready(function () {
  result = getEquation();

  $('#startButton').one('click', function () {
    $('#answerBox').unbind();
    playGame(timer);
  });

  $('#answerBox').one('input', function () {
    $('#startButton').unbind();
    playGame(timer);
  });
  
});