//define all the variables
var maximumnum;
var minimumnum;
var noofquestion = 10;
var championtime;
var goalminute;
var goalsecond;
var starttime;
var endtime;
var timetook;
var questions;
var quiz;
var randomlist;
var resultlist;
var operation;
var operationString; // √ ²  ³ ∛
var rootOp;
var stoptimer = false;

function populate() {
  if(quiz.questionIndex == 0) {
    starttime = performance.now();
  }
  if(quiz.isEnded()) {
    endtime = performance.now();
    timetook = endtime - starttime;
    timetook = Math.floor(timetook / 1000);
    showScores(timetook);
    stoptimer = true;
  }
  if(stoptimer == false) {
    // show question
    var element = document.getElementById("question");
    element.innerHTML = quiz.getQuestionIndex().text;
    // show options
    var choices = quiz.getQuestionIndex().choices;
    for(var i = 0; i < choices.length; i++) {
      var element = document.getElementById("choice" + i);
      element.innerHTML = choices[i];
      guess("btn" + i, choices[i]);
    }
    showProgress();
  }
};

function guess(id, guess) {
  var button = document.getElementById(id);
  button.onclick = function() {
    quiz.guess(guess);
    populate();
  }
};

function showProgress() {
  var currentQuestionNumber = quiz.questionIndex + 1;
  var element = document.getElementById("progress");
  element.innerHTML = "Question " + currentQuestionNumber + " of " + quiz.questions.length;
};

function showScores(timetook) {
  var scorepercent = Math.floor((quiz.score / 10) * 100);
  var timepercent = Math.floor((championtime / timetook) * 100);
  if(timepercent > 100) {
    timepercent = 100;
  };
  var grosspercent = Math.floor((scorepercent + timepercent) / 2);
  var gameOverHTML = "<h1>Result</h1>";
  gameOverHTML += "<h2 id='score'> Your score: " + quiz.score + "/10</h2>";
  gameOverHTML += "<h2 id='score'> Range: (" + minimumnum + " - " + maximumnum + ")</h2>";
  gameOverHTML += "<h2 id='score'> Time took: " + timetook + " secs" + "</h2>";
  gameOverHTML += "<h2 id='score'> Your Goal: " + championtime + " secs" + "</h2>";
  gameOverHTML += "<h2 id='score'> Gross Score: " + grosspercent + " %" + "</h2>";
  gameOverHTML += "<h2 id='score'>" + complement(grosspercent) + "</h2>";
  gameOverHTML += "<button id='restart' onclick='restart(originalhtml)'>REPLAY</button>"
  var element = document.getElementById("quiz");
  originalhtml = element.innerHTML;
  element.innerHTML = gameOverHTML;
};

function complement(grosspercent) {
  if(grosspercent < 50) {
    return "You seriously need more practise";
  } else if(grosspercent >= 50 && grosspercent <= 80) {
    return "Good Job. Keep practising and reach your goal";
  } else if(grosspercent > 80 && grosspercent <= 95) {
    return "You are very near to your goal keep going";
  } else if(grosspercent > 95 && grosspercent < 100) {
    return "Even the sky is not the limit keep going";
  } else if(grosspercent >= 100) {
    return "Congrats you finally reached your goal";
  }
}

function randomgen(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomnumbers() {
  randomlist = [];
  resultlist = [];
  for(var i = 0; i < noofquestion; i++) {
    randomlist.push(randomgen(minimumnum, maximumnum + 1));
  }
  for(var i = 0; i < noofquestion; i++) {
    resultlist.push(Math.pow(randomlist[i], operation));
  }
}

function generateQuestions() {
  questions = [];
  for(var i = 0; i < 10; i++) {
    if(rootOp) {
      str = operationString + randomlist[i];
      var resultstr = resultlist[i].toFixed(2);
      var firstdigit = Number(resultstr[0]);
      var restdigit = resultstr.slice(1);
      ansarr = [
        Number(String(firstdigit - 1) + restdigit),
        Number(String(firstdigit + 2) + restdigit),
        Number(String(firstdigit + 1) + restdigit),
        Number(resultlist[i]).toFixed(2)
      ];
      corans = resultlist[i].toFixed(2);
    } else {
      str = randomlist[i] + operationString;
      ansarr = [
        Math.pow(Number(randomlist[i]) - 1, operation),
        Math.pow(Number(randomlist[i]) + 1, operation),
        Math.pow(Number(randomlist[i]) - 2, operation),
        resultlist[i]
      ];
      corans = resultlist[i];
    }
    questions.push(new Question(str, ansarr, corans));
  }
  console.log(questions);
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while(0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function restart(originalhtml, timetook) {
  var element = document.getElementById('quiz');
  element.innerHTML = originalhtml;
  quiz.questionIndex = 0;
  quiz.score = 0;
  document.getElementById('timer').innerHTML = goalminute + ":" + goalsecond;
  stoptimer = false;
  generateRandomnumbers();
  generateQuestions();
  shuffle(questions);
  for(var i = 0; i < questions.length; i++) {
    shuffle(questions[i].choices);
  }
  quiz = new Quiz(questions);
  startTimer();
  populate();
}

function startTimer() {
  if(stoptimer == false) {
    var presentTime = document.getElementById('timer').innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    //if(m<0){alert('timer completed')}
    document.getElementById('timer').innerHTML = m + ":" + s;
    setTimeout(startTimer, 1000);
    if(s == 59) {
      m = m - 1
    } else if(m == 0 && s == 0) {
      endtime = performance.now();
      timetook = endtime - starttime;
      timetook = Math.floor(timetook / 1000);
      showScores(timetook + 1);
      stoptimer = true;
    }
  }
}

function checkSecond(sec) {
  if(sec < 10 && sec >= 0) {
    sec = "0" + sec
  }; // add zero in front of numbers < 10
  if(sec < 0) {
    sec = "59"
  };
  return sec;
}
// display quiz
// var starttime = performance.now();
window.onload = function() {
  var start = document.getElementById('start');
  start.onclick = function() {
    document.getElementsByClassName('intro')[0].style.display = "none";
    document.getElementsByClassName('grid')[0].style.display = "block";
    maximumnum = Number(document.getElementById('maxnum').value);
    minimumnum = Number(document.getElementById('minnum').value);
    championtime = Number(document.getElementById('goaltime').value);
    goalminute = Math.floor(championtime / 60);
    goalsecond = Math.floor(championtime % 60);
    var sqbtn = document.getElementById('sq').checked;
    var cubtn = document.getElementById('cu').checked;
    var sqrtbtn = document.getElementById('sqrt').checked;
    var curtbtn = document.getElementById('curt').checked;
    if(sqbtn) {
      operation = 2; //√ ²  ³ ∛
      operationString = '²';
    } else if(cubtn) {
      operation = 3;
      operationString = '³';
    } else if(sqrtbtn) {
      operation = 1 / 2;
      operationString = '√';
      rootOp = true;
    } else if(curtbtn) {
      operation = 1 / 3;
      operationString = '∛';
      rootOp = true;
    }
    generateRandomnumbers();
    generateQuestions();
    shuffle(questions);
    for(var i = 0; i < questions.length; i++) {
      shuffle(questions[i].choices);
    }
    document.getElementById('timer').innerHTML = goalminute + ":" + goalsecond;
    startTimer();
    // create quiz
    quiz = new Quiz(questions);
    populate();
  }
}