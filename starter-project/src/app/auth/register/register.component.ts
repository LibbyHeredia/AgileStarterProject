import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import { Answer } from '../../shared/answer.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { QuestionService } from 'src/app/shared/question.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  ui : firebaseui.auth.AuthUI;
  emailPattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$";
  userName : Answer

  constructor(
    private service: AuthService,
    private router : Router,
    private firestore : AngularFirestore,
    private toastr : ToastrService,
    public afAuth : AngularFireAuth  ) { }

  ngOnInit() {
    this.resetForm();
    const uiConfig = {
      signInSuccessURL: "http://localhost:4200/quiz/",
      signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
      ],
    };

    this.userName = {
      name:"",
      answers :[],
      score :0
    }

    console.log(this.userName)
    this.ui = new firebaseui.auth.AuthUI(this.service.afAuth.auth);
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  resetForm(form? : NgForm){
    if(form != null)
      form.resetForm();
    this.service.formData ={
      answers : [],
      user : '',
      email : '',
      password : '',
      score : null
    }
  }

  onSubmit(form : NgForm){
    console.log("Submitted");
    let data = form.value;
    this.userName.name = data.name
    console.log(this.userName)
    //insert into firestore DB collection
    this.afAuth.authState.subscribe(user=>{
      if(user){
          const userRef : AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`)
          userRef.set(this.userName, {
          merge: true
        })
        //this.firestore.collection("users").add(this.userName)
      }
    })
    this.resetForm(form);
    this.navigateToLogin();
    this.toastr.success("Submitted succesfully", 'Quiz Register')
  }


  navigateToLogin(){
    this.router.navigate(['./login'])
  }

}
