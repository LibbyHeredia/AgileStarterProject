import { Observable } from 'rxjs/Observable';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Answer } from './answer.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Routes, RouterModule } from '@angular/router';

@Injectable()

export class QuestionService{

  userQuestionDataDocument: AngularFirestoreDocument<Question>;
  questionData : Question
  formQuestionData : any; //Saved logged in user question data
  currentQN : number
  numAnswered : number
  currentQNimage : string
  currentQNquestion : string
  currentQNchoices : Array<string> =[];
  NUMBER_QUESTIONS : number
  finalScore : number
  userSelectedAnswers : Answer
  resultsExplanationsArray : Array<string> =[];
  resultsExplanation : string
  resultImage : string

  readonly rootUrl = 'http://localhost:4200';
  constructor(
    public fbService: AngularFirestore,
    public afAuth : AngularFireAuth
  ){

    /*Saving user data in local storage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user=>{
      if(user){
        console.log("QUESTION SERVICE USER")
        console.log(user.uid)
        this.formQuestionData = user;
        localStorage.setItem('user', JSON.stringify(this.formQuestionData));
        JSON.parse(localStorage.getItem('user'));
      } else {
          localStorage.setItem('user',null);
          JSON.parse(localStorage.getItem('user'));
      }
    })
    this.numAnswered = 0
    this.finalScore = -1
    this.NUMBER_QUESTIONS = 5
    this.resultsExplanationsArray = ["Wow look at that dedication. You must be a First Year or something",
    "You suffer from some senioritis (thought it is not fatal yet).",
    "You suffer from heavy senioritis, but still make it to class somehow. Kudos!",
    "Just graduate already, jeez."]
    this.ResetUserAnswerData()
  }

  ResetUserAnswerData(){

    this.questionData = {
      questions: {
        0: "How often do you pull all-nighters?",
        1: "What time did you get up today?",
        2: "How many incomplete assignments do you have right now?",
        3: "How many classes have you skipped this semester?",
        4: "How many times have you worn sweatpants to class this week?"

      },
      choices : {
        0: ["What is sleep?","All the time. I am 75% caffeine.","Occasionally, if there is an emergency.","I nap every day and am in bed by 10. All-nighters are for the youngins."],
        1: ["Early Morning.","Noon.","Afternoon.","I didn't get up today..."],
        2: ["None! I'm way ahead in all of my classes. ","One or two.","A few...", "Who knows? It's one of life's great mysteries."],
        3: ["None. Not even the polar vortex could keep me from going to class!","I've skipped a few here and there.","I only attend 1 class because the Professor takes attendance.","Wait, I'm still enrolled in school?"],
        4: ["Um, I always dress up for class and would never wear sweatpants to class.","Only when I'm running late.","I wear them quite a bit!","My closet is exclusively groutfits."]

      },
      images : ['Q0.jpg', 'Q1.jpg','Q2.jpg','Q3.jpg','Q4.jpg'],
      answers: [-1, -1, -1, -1, -1]

    }

    this.currentQN = 0
    this.userSelectedAnswers = {
      name : "",
      answers : [],
      score : 0
    }
    this.LoadQuestion()
  }

  LoadQuestion(){
      var QN = this.GetCurrentQN()
      this.GetCurrentQNImage(QN)
      this.GetCurrentQNQuestion(QN)
      this.GetCurrentQNChoices(QN)

      console.log("Loading Question...")
      console.log(this.GetCurrentQN())
      console.log("Current image:")
      console.log(this.GetCurrentQNImage(QN))
    }

  checkDone(){
    console.log("checking if done")
    if(!this.questionData.answers.includes(-1)){
      console.log("time to submit")
      let body = document.getElementsByName('action')[0];
      body.classList.remove('disabled');
    }
  }


  SetUserAnswer(QNumber, answer){
    this.questionData.answers[QNumber]= answer
    this.userSelectedAnswers.answers[QNumber] = answer
    console.log("Answer selected: ")
    console.log(this.questionData.answers[QNumber])
    console.log(" User answers so far: ")
    console.log(this.questionData.answers)
    this.GetNextQuestion();
    this.LoadQuestion()

    this.checkDone()

    const user = this.formQuestionData

    const userRef : AngularFirestoreDocument<any> = this.fbService.doc(`users/${user.uid}`)
    userRef.set({
      "answers": this.userSelectedAnswers.answers
    },{merge: true})

  }

  GetCurrentQNChoices(QNumber){
    this.currentQNchoices = this.questionData.choices[QNumber]
    return this.questionData.choices[QNumber]
  }

  GetCurrentQNQuestion(QNumber){
    this.currentQNquestion = this.questionData.questions[QNumber]
    return this.questionData.questions[QNumber]
  }

  GetCurrentQN(){
    console.log(this.currentQN)
    return this.currentQN;
  }

  GetNextQuestion(){
    if(this.currentQN + 1 >=  this.NUMBER_QUESTIONS){
      return this.currentQN
    }
    return this.currentQN = this.currentQN + 1
  }


  GetCurrentQNImage(QNumber){
    this.currentQNimage = this.questionData.images[QNumber]
    return this.questionData.images[QNumber]
  }

  GetPreviousQuestion(){
    if(this.currentQN > 0){
      return this.currentQN = this.currentQN - 1
    }
  }

  GoToPreviousQuestion(){

    if(this.currentQN > 0){
      this.currentQN = this.currentQN - 1
      this.LoadQuestion()
    }
  }


  GoToNextQuestion(){
    if(this.currentQN < 4){
      this.currentQN = this.currentQN + 1
      this.LoadQuestion()
    }
  }

  CalculateScore(){
    var sum = 0;
    for( var i = 0; i < this.questionData.answers.length; i++ ){
      sum += this.questionData.answers[i]
    }

    this.finalScore = Math.round((sum/this.questionData.answers.length)/3 * 100);

    console.log("the average score is:")
    console.log(this.finalScore)
    this.processResults()
    this.userSelectedAnswers.score = this.finalScore

    const user = this.formQuestionData
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc(`users/${user.uid}`)
    userRef.set({
      "score": this.userSelectedAnswers.score
    }, {merge: true})
  }

  processResults() {

    console.log(this.finalScore)
    if(this.finalScore < 25){
      this.resultsExplanation = this.resultsExplanationsArray[0]
      this.resultImage = "R1.jpg"
    }
    else if(this.finalScore < 50 && this.finalScore >=25){
      this.resultsExplanation = this.resultsExplanationsArray[1]
      this.resultImage = "R2.jpg"
    }
    else if(this.finalScore < 75 && this.finalScore >=50){
      this.resultsExplanation = this.resultsExplanationsArray[2]
      this.resultImage = "R3.jpg"
    }
    else {
      this.resultsExplanation = this.resultsExplanationsArray[3]
      this.resultImage = "R4.jpg"
    }

  }
}
