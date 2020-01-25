import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuizService } from '../../shared/quiz.service';
import { AngularFirestore} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ui : firebaseui.auth.AuthUI;

  constructor(
    private service: AuthService,
    private router : Router,
    private firestore : AngularFirestore,
    private toastr : ToastrService  ) { }

  ngOnInit() {
    this.initForm()
    const uiConfig = {
      signInSucessURL: "https://localhost:4200/quiz/",
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

  onLoginSuccessful(form : NgForm){
    let loginInfo = form.value;
    this.service.login(loginInfo.email,loginInfo.password)
    this.navigateToQuiz()
    this.toastr.success("Login Successful", 'Quiz Login')
  }

  navigateToQuiz(){
    this.router.navigate(['./quiz'])
  }
}
