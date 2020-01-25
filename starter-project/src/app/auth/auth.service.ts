import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { QuizService } from '../shared/quiz.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from '@angular/router';
import { Auth } from './auth.service.model'; //"User"
import { auth } from 'firebase/app';
//TODO: Finish Auth Service
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  formData : any; //Saved logged in user data

  constructor(
    private router: Router,
    private fbService: AngularFirestore, //"afs" Inject Firestore service
    public afAuth : AngularFireAuth, // Inject Firebase auth service
    private ngZone : NgZone //NgZone to remove outside scope warning
  ) {

    /*Saving user data in local storage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user=>{
      if(user){
        this.formData = user;
        localStorage.setItem('user', JSON.stringify(this.formData));
        JSON.parse(localStorage.getItem('user'));
      } else {
          localStorage.setItem('user',null);
          JSON.parse(localStorage.getItem('user'));
      }
    })
  }


  //register with email/password
  register(email, password, name) {
      console.log(name, email, password)

      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(userObj => {
          /*Call the SendUserData() function when new user registration and
          returns promise */
          this.SetUserData(userObj.user) //
          this.router.navigate(['/login'])
          //this.fbService.createUser(userObj.user.uid,name)
        })
        .catch(error => { // to account for errors in request/promise
          console.log(error.message)
        })
      }

  //log in with email and password
  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userObj => {
        this.ngZone.run(() => {
          this.router.navigate(['quiz']);
        });
        this.SetUserData(userObj.user);
      }).catch(error => {
        console.log(error.message)
        this.handleError(error.code)
      })
  }

  /*Returns true when user is logged in*/
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null ) ? true : false;
  }

  /*Auth logic to run auth providers*/

  AuthLogin(provider){
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
      this.ngZone.run(() => {
        this.router.navigate(['quiz']);
      })
    this.SetUserData(result.user);
    }).catch((error) => {
      console.log(error)
    })
  }

  /*Sign in with Facebook*/
  FacebookAuth(){
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

  /*Sign in with Facebook*/
  TwitterAuth(){
    return this.AuthLogin(new auth.TwitterAuthProvider());
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user){
    const userRef : AngularFirestoreDocument<any> = this.fbService.doc('users/${user.userID}')
    const userData : Auth = {
      userID : user.userID,
      user : user.user,
      email : user.email,
      password : user.password,
      score : user.score,
      answers : user.answers
    }

    return userRef.set(userData , {
      merge: true
    })
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
