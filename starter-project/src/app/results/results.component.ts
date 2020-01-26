import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { QuestionService } from '../shared/question.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsPageComponent implements OnInit {

  
  constructor(
    private QuestionService: QuestionService,
    private toastr : ToastrService,
    private firestore : AngularFirestore  ) { 

    }

  ngOnInit() {

    
  }

}
