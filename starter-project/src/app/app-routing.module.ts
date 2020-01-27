import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent} from './auth/login/login.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultsPageComponent } from './results/results.component';
import { AuthGuard } from './auth/auth.guard';


export const routes: Routes = [
  {path:'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path:'quiz', component: QuizComponent},
  {path:'results', component:ResultsPageComponent},

  //route for default routing
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  //set routing paths to components
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
