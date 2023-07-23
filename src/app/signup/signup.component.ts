import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { collection , doc, Firestore, setDoc} from '@angular/fire/firestore';

export function matchValidator():ValidatorFn {
  return ( control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if(password && confirmPassword && (password!==confirmPassword))
      return {passwordnotmatch: true};
    else return null;
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  phide=true;
  cphide=true;
  constructor(private auth: AuthenticationService, private router: Router, private fs:Firestore){

  }
  testForm =new FormGroup({
    gmail: new FormControl('')
  })

  signUpForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('',[Validators.required])
  }, {validators: matchValidator() })

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get name() {
    return this.signUpForm.get('name');
  }

  submit(){
    const userdata = Object.assign(this.signUpForm.value);
  
    if(!this.signUpForm.valid || !this.name || !this.email || !this.password ) return;
    else {
      this.auth.signUp(userdata.email, userdata.password).subscribe((data)=>{
        var u = data.user;
        console.log(u);
        this.router.navigate(['']);
    });
  }
}

}
