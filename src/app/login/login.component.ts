import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  hide=true;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    ){}

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }
  submit(){
    if(!this.loginForm.valid) return;
  
    const userdata =Object.assign( this.loginForm.value);
    this.authService.login(userdata).subscribe(() => {
      this.router.navigate(['home']);
    })

    
  }
}
