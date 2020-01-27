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
    this.ResetUserAnswerData()
  }

  ResetUserAnswerData(){

    this.questionData = {
      questions: {
        0: "What are your thoughts on pulling all-nighters…?",
        1: "When did you get up today?",
        2: "Do you have any incomplete assignments?",
        3: "Did you skip class today?",
        4: "How many times have you work sweatpants to class this semester?"

      },
      choices : {
        0: ["Never","Occasionally","Often","Sleep is for the weak"],
        1: ["Early Morning","Around Lunch","Afternoon","I didn't get up today"],
        2: ["None at all ","Maybe 1","I have a few","I dont know, probably a lot"],
        3: ["I did not skip any classes","I only skipped 1-2","I only attended 1 class because they take attendance","I no longer go to school"],
        4: ["I actively dress up for class and would never wear sweatpants to class","Maybe once if I'm late","I wear them quite a bit","I only own groutfits"]

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

    this.finalScore = sum/this.questionData.answers.length;
    console.log("the average score is:")
    console.log(this.finalScore)

    this.userSelectedAnswers.score = this.finalScore

    const user = this.formQuestionData
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc(`users/${user.uid}`)
    userRef.set({
      "score": this.userSelectedAnswers.score
    }, {merge: true})
  }
}
