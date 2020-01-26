import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  ui : firebaseui.auth.AuthUI;
  emailPattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$";

  constructor(
    private service: AuthService,
    private router : Router,
    private firestore : AngularFirestore,
    private toastr : ToastrService  ) { }

  ngOnInit() {
    this.resetForm();
    const uiConfig = {
      signInSuccessURL: "http://localhost:4200/login/",
      signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
      ],
    };
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

    //insert into firestore DB collection
    this.firestore.collection("users").add(data)
    this.resetForm(form);
    this.navigateToLogin();
    this.toastr.success("Submitted succesfully", 'Quiz Register')
  }

  navigateToLogin(){
    this.router.navigate(['./login'])
  }

}
