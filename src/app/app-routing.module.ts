import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['']);
const redirectToHome = () => redirectLoggedInTo(['home']);
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'signup',
    pathMatch: 'full',
    component: SignupComponent,
    ...canActivate(redirectToHome),
  },
  {
        path: 'home',
    pathMatch: 'full',
    component: HomeComponent,
    ...canActivate(redirectToLogin),
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
