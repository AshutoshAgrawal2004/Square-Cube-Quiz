function Quiz(questions) {
  this.score = 0;
  this.questions = questions;
  this.questionIndex = 0;
}
Quiz.prototype.getQuestionIndex = function() {
  return this.questions[this.questionIndex];
}
Quiz.prototype.guess = function(answer) {
  if(this.getQuestionIndex().isCorrectAnswer(answer)) {
    this.score++;
  } else {
    console.log(this.getQuestionIndex());
    console.log(answer);
    endtime = performance.now();
    timetook = endtime - starttime;
    timetook = Math.floor(timetook / 1000);
    showScores(timetook);
    stoptimer = true;
  }
  this.questionIndex++;
}
Quiz.prototype.isEnded = function() {
  return this.questionIndex === this.questions.length;
}