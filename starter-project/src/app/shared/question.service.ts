import { Observable } from 'rxjs/Observable';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable()

export class QuestionService{

  userQuestionDataDocument: AngularFirestoreDocument<Question>;
  userAnswerData : Question
  formQuestionData : any; //Saved logged in user question data
  currentQN : number
  currentQNimage : string
  currentQNquestion : string
  currentQNchoices : Array<string> =[];

  readonly rootUrl = 'http://localhost:4200';
  constructor(
    public fbService: AngularFirestore,
    public afAuth : AngularFireAuth
  ){

    /*Saving user data in local storage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user=>{
      if(user){
        this.formQuestionData = user;
        localStorage.setItem('user', JSON.stringify(this.formQuestionData));
        JSON.parse(localStorage.getItem('user'));
      } else {
          localStorage.setItem('user',null);
          JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  ResetUserAnswerData(){
    console.log("QUIZ SERVICE: Reset User Answer Data")
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc('users/${user.userID}')

    this.userAnswerData = {
      questions: {
        1: "Question 1 Text?",
        2: "Question 2 Text?",
        3: "Question 3 Text?",
        4: "Question 4 Text?",
        5: "Question 5 Text?",

      },
      choices : {
        1: ["Answer","Answer","Answer","Answer"],
        2: ["Answer","Answer","Answer","Answer"],
        3: ["Answer","Answer","Answer","Answer"],
        4: ["Answer","Answer","Answer","Answer"],
        5: ["Answer","Answer","Answer","Answer"],
      },
      images : ['Q1.jpg','Q1.jpg','Q1.jpg','Q1.jpg'],
      answers: []
    }
    this.currentQN = 0
    this.currentQNimage = "Q1.jpg"
    this.currentQNquestion = this.userAnswerData.questions[this.currentQN]
    this.currentQNchoices = this.userAnswerData.choices[this.currentQN]

    console.log("QUIZ SERVICE: Setting userRef with userAnswerData")
    return userRef.set(this.userAnswerData, {
      merge: true
    })
  }

  //ANSWER
  SetUserAnswer(QNumber, answer){
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc('users/${user.userID}')
    this.userAnswerData.answers[QNumber]= answer
  }

  GetCurrentQNChoices(QNumber){
    console.log("Getting current QN choices")
    console.log(this.currentQNchoices)
    return this.userAnswerData.choices[QNumber]
  }

  GetCurrentQNQuestion(QNumber){
    return this.userAnswerData.questions[QNumber]
  }

  GetCurrentQN(){
    console.log(this.currentQN)
    this.currentQN;
  }

  GetNextQuestion(qn){

  }

  GetCurrentQNImage(QNumber){
    this.currentQNimage = this.userAnswerData.images[QNumber]

  }
}
