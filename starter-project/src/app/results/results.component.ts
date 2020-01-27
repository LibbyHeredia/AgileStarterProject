import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { QuestionService } from '../shared/question.service';

import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsPageComponent implements OnInit {


  constructor(
    private QuestionService: QuestionService,
    private toastr : ToastrService,
    private firestore : AngularFirestore,
    private router :Router,
    public afAuth : AngularFireAuth) {

    }

  ngOnInit(){

  }

  StartOver(){
    console.log("starting over")
    this.router.navigate(['/quiz'])
  }

  SignOut(){
    this.afAuth.auth.signOut();
    this.router.navigate(['/login'])
  }
}
