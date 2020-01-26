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
    this.ResetUserAnswerData()
  }

  ResetUserAnswerData(){
    console.log("QUIZ SERVICE: Reset User Answer Data")
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc('users/${user.uid}')

    this.userAnswerData = {
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
    this.LoadQuestion()
    console.log("QUIZ SERVICE: Setting userRef with userAnswerData")
    return userRef.set(this.userAnswerData, {
      merge: true
    })
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
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc('users/${user.userID}')
    this.userAnswerData.answers[QNumber]= answer
    console.log("Answer selected: ")
    console.log(this.userAnswerData.answers[QNumber])
    console.log(" User answers so far: ")
    console.log(this.userAnswerData.answers)
    this.GetNextQuestion();
    this.LoadQuestion()
  }

  GetCurrentQNChoices(QNumber){
    this.currentQNchoices = this.userAnswerData.choices[QNumber]
    return this.userAnswerData.choices[QNumber]
  }

  GetCurrentQNQuestion(QNumber){
    this.currentQNquestion = this.userAnswerData.questions[QNumber]
    return this.userAnswerData.questions[QNumber]
  }

  GetCurrentQN(){
    console.log(this.currentQN)
    return this.currentQN;
  }

  GetNextQuestion(){
    console.log("Getting next QN... ")
    console.log(this.currentQN + 1)

    return this.currentQN = this.currentQN + 1
  }


  GetCurrentQNImage(QNumber){
    this.currentQNimage = this.userAnswerData.images[QNumber]
    return this.userAnswerData.images[QNumber]
  }

  GetPreviousQuestion(){
    console.log("Getting next QN... ")
    console.log(this.currentQN - 1)

    return this.currentQN = this.currentQN - 1
    this.LoadQuestion()
  }
}
