import { Observable } from 'rxjs/Observable';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Question } from './question.model';


@Injectable()

export class QuestionService{
  itemsCollection: AngularFirestoreCollection<Question>;

  items: Observable<Question[]>;

  constructor(public afs: AngularFirestore){
    this.items = this.afs.collection('items').valueChanges();
  }

  getItems(){
    return this.items;
  }
}
