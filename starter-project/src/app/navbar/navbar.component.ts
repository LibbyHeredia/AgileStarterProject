import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  links = ["Sign Out"]
  username = ""


  constructor(
    private router :Router,
    private firestore : AngularFirestore,
    public afAuth : AngularFireAuth
  ) {

  this.GetUserName()
  console.log("USERNAME")
  console.log(this.username)
  }

  GetUserName(){

    this.afAuth.authState.subscribe(user=>{
      if(user){

        var docRef = this.firestore.collection("users").doc(`${user.uid}`).ref;

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("NAME---")
                console.log(typeof(doc.data().name))

                let hold = doc.data().name
                //this.username = hold

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
    })

  }
  SignOut(link){
    if(link == "Sign Out"){
      this.router.navigate['/login']
    }
  }
  ngOnInit() {
  }

}


//TODO: Fix Login Page and Email on Register Page using Angular7/8 Tutorial again
//Make Previous and Next Buttons work
//Make database hold user name from local storage
//Make results page.  Possibly use stats.
//Make nav bar
//Pretty everything up
//Maybe add more questions
//Set up Auth Guard
