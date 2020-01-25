import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../shared/question.service';
import { QuizService } from '../shared/quiz.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-Quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {


  constructor(
    private QuestionService: QuestionService,
    private toastr : ToastrService,
    private firestore : AngularFirestore  ){

  }

  ngOnInit(){
    this.resetQuizForm();
  }

  resetQuizForm(form? : NgForm){
    console.log("Reseting Quiz Form");
    if(form != null)
      form.resetForm();
    this.QuestionService.ResetUserAnswerData();
    console.log("Quiz Form Reset.");
  }

  onSelectAnswer( form : NgForm){
    console.log("Answer selected");

    let data = form.value;

    this.nextQuestion();

  }

  updateQuizFormData(form? : NgForm){
    //TODO
    this.QuestionService.SetUserAnswer(1,2)
  }

  nextQuestion(){

  }
}
