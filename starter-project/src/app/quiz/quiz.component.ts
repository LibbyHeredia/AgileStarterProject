import { Component, OnInit } from '@angular/core';

import { QuestionService } from '../shared/question.service';

import { QuizService } from '../shared/quiz.service';



@Component({
  selector: 'app-Quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {


  constructor(public itemService: QuestionService){

  }

  ngOnInit(){
    this.itemService.getItems().subscribe(items => {
      console.log(items);
    });
  }

}
