import { Component, OnInit, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuizService } from '../../shared/quiz.service';
import { AngularFirestore} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ui : firebaseui.auth.AuthUI;
  error_message : ""

  constructor(
    public service: AuthService,
    private router : Router,
    private firestore : AngularFirestore,
    private toastr : ToastrService,
    public afAuth : AngularFireAuth, // Inject Firebase auth service
    private ngZone : NgZone //NgZone to remove outside scope warning
    ) { }

  ngOnInit() {
    this.initForm()
    const uiConfig = {
      signInSuccessURL: "http://localhost:4200/quiz/",
      signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
      ],
      /*callbacks: {
          signInSuccessWithAuthResult :
            this.onLoginSuccessful
            .bind(this)
      }*/
    };
    this.ui = new firebaseui.auth.AuthUI(this.service.afAuth.auth);
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  initForm(form? : NgForm){
    if(form != null)
      form.resetForm();
    this.service.formData = {
      answers : {},
      user : '',
      email : '',
      password : '',
      score : null,
      userID : ''
    }
  }
  //log in with email and password
  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userObj => {}).catch(error => {

        console.log(error.message)
        this.error_message = error.message
      })
  }
  onLoginSuccessful(form : NgForm){
    let loginInfo = form.value;
    this.service.login(loginInfo.email,loginInfo.password)
    this.toastr.success("Login Successful", 'Login')

    this.navigateToQuiz()
  }

  navigateToQuiz(){
    this.router.navigate(['./quiz'])
  }
}
