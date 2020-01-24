import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Query } from '@firebase/firestore-types'

@Injectable({ providedIn: 'root' })

export class DatabaseService {
users: any[];

constructor(private db: AngularFirestore) {}

//Logic goes here
  getUsers(){

  }

}
