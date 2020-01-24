import { Injectable } from '@angular/core';
import { Quiz } from './quiz.model';
import * as firebase from 'firebase/app';
import { Query } from '@firebase/firestore-types'
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class QuizService {
  formData: Quiz;
  constructor(private db: AngularFirestore) { }

  createUser(userID: string, name: any) {
    this.db.collection("users").doc(userID).set({
      userId: userID,
      score : 0,
      answers : {}

    })
      .then(() => {
        console.log("User successfully created.")
      })
      .catch(error => console.log("Error creating user:", error))
  }

  getUser(userID: string) {
    return this.db.collection("users").doc(userID).get()
  }

}
