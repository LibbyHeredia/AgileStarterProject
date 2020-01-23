import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultsPageComponent } from './results/results.component';


export const routes: Routes = [
  {path:'register', component: RegisterComponent},
  {path:'quiz', component: QuizComponent },
  {path:'results', component:ResultsPageComponent},

  //route for default routing
  {path:'', redirectTo:'/register', pathMatch:'full'}
];

@NgModule({
  //set routing paths to components
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
