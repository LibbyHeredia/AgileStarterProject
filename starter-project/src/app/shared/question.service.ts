import { Observable } from 'rxjs/Observable';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Answer } from './answer.model';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable()

export class QuestionService{

  userQuestionDataDocument: AngularFirestoreDocument<Question>;
  questionData : Question
  formQuestionData : any; //Saved logged in user question data
  currentQN : number
  currentQNimage : string
  currentQNquestion : string
  currentQNchoices : Array<string> =[];
  NUMBER_QUESTIONS : number
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
    this.NUMBER_QUESTIONS = 5
    this.ResetUserAnswerData()
  }

  ResetUserAnswerData(){
    console.log("QUIZ SERVICE: Reset User Answer Data")

    this.questionData = {
      questions: {
        0: "Question 1 Text?",
        1: "Question 2 Text?",
        2: "Question 3 Text?",
        3: "Question 4 Text?",
        4: "Question 5 Text?",

      },
      choices : {
        0: ["Answer1","Answer1","Answer1","Answer1"],
        1: ["Answer2","Answer2","Answer2","Answer2"],
        2: ["Answer3","Answer3","Answer3","Answer3"],
        3: ["Answer4","Answer4","Answer4","Answer4"],
        4: ["Answer5","Answer5","Answer5","Answer5"],
      },
      images : ['Q0.jpg','Q1.jpg','Q2.jpg','Q3.jpg','Q4.jpg'],
      answers: []
    }
    this.currentQN = 0
    this.userSelectedAnswers = {
      answers : [],
      score : 0
    }
    this.LoadQuestion()
    console.log("QUIZ SERVICE: Setting userRef with userAnswerData")

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
  //ANSWER
  SetUserAnswer(QNumber, answer){


    this.questionData.answers[QNumber]= answer
    this.userSelectedAnswers.answers[QNumber] = answer
    console.log("Answer selected: ")
    console.log(this.questionData.answers[QNumber])
    console.log(" User answers so far: ")
    console.log(this.questionData.answers)
    this.GetNextQuestion();
    this.LoadQuestion()

    const user = this.formQuestionData
    console.log("USER ID")
    console.log(user.uid)
    console.log('users/${user.uid}')
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc(`users/${user.uid}`)
    userRef.set( this.userSelectedAnswers, {
      merge: true
    })
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
    console.log("Getting next QN... ")
    console.log(this.currentQN + 1)
    console.log(this.NUMBER_QUESTIONS)
    console.log(">:(")


    if(this.currentQN + 1 >=  this.NUMBER_QUESTIONS){
      console.log("HERE")

      return this.currentQN
    }
    return this.currentQN = this.currentQN + 1
  }


  GetCurrentQNImage(QNumber){
    this.currentQNimage = this.questionData.images[QNumber]
    return this.questionData.images[QNumber]
  }

  GetPreviousQuestion(){
    console.log("Getting next QN... ")
    console.log(this.currentQN - 1)

    return this.currentQN = this.currentQN - 1
    this.LoadQuestion()
  }
}
