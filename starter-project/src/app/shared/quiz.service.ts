import { Injectable } from '@angular/core';
import { Quiz } from './quiz.model';
import * as firebase from 'firebase/app'
import { Query } from '@firebase/firestore-types'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { QuestionService } from './question.service';
@Injectable({
  providedIn: 'root'
})

export class QuizService {
  formData: any;
  constructor(
    private service: QuestionService,
    public afAuth : AngularFireAuth
  ) {
    /*Saving user data in local storage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user=>{
      if(user){
        console.log("QUIZ SERVICE CONSTRUCTOR")
        this.AllQuestionsAnswered()
        console.log(user.uid)
        this.formData = user;
        localStorage.setItem('user', JSON.stringify(this.formData));
        JSON.parse(localStorage.getItem('user'));
      } else {
          localStorage.setItem('user',null);
          JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  AllQuestionsAnswered(){
    console.log("NAV BAR STUFF")
    this.service.afAuth.authState.subscribe(user=>{

      const colRef : AngularFirestoreCollection<any> = this.service.fbService.collection('users')
      //const userRef : AngularFirestoreDocument<any> = this.service.fbService.doc(`users/${user.uid}`)

      console.log(user)
    })
    return false
  }




}
