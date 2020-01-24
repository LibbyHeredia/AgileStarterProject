import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { QuizService } from '../shared/quiz.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from '@angular/router';
import { Auth } from './auth.service.model'; //"User"

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  formData : Auth; //Saved logged in user data

  constructor(private router: Router,
    private fbService: QuizService, //"afs" Inject Firestoer service
    private afAuth : AngularFireAuth, // Inject Firebase auth service
    private ngZone : NgZone
  ) { }
  //TODO Finsh Auth Service

  register(email, password, name) {
      console.log(name, email, password)

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userObj => { //.then waits for response
          this.router.navigate(['/login'])
          this.fbService.createUser(userObj.user.uid,name)
        })
        .catch(error => { // to account for errors in request/promise
          console.log(error)
        })
    }

  login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userObj => {
        sessionStorage.setItem('userID',userObj.user.uid)

      this.fbService.getUser(userObj.user.uid)
        .subscribe(user=> {
          sessionStorage.setItem('user', user.data().name)
        })
      }).catch(error => this.handleError(error.code))


  }

  //function to handle error codes
  handleError(errorCode: any) {

      switch (errorCode) {

        //login
        case 'auth/invalid-email':
          console.log('Your email is invalid.')
          break;
        case 'auth/user-disabled':
          console.log('Your account is disabled.')
          break;
        case 'auth/user-not-found':
          console.log('Your email is not registered.')
          break;
        case 'auth/wrong-password':
          console.log('Your password is invalid.')
          break;

        //register
        case 'auth/email-already-in-use':
          console.log('Email already in use')
          break;
        case 'auth/invalid-email':
          console.log('Email address is invalid')
          break;
        case 'auth/operation-not-allowed':
          console.log('Operation not allowed');
          break;
        case 'auth/weak-password':
          console.log('Password is weak');
          break;

        //reset
        case 'auth/invalid-email':
          console.log('Email invalid');
          break;
        case 'auth/user-not-found':
          console.log('No user found');
          break;

      }
    }
}
