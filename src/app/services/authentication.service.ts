import { Injectable } from '@angular/core';
import { Auth, authState, user} from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Observable, from, of, switchMap } from 'rxjs';
import {Firestore, addDoc, doc, setDoc} from '@angular/fire/firestore';
import { collection, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private auth: Auth,private fs: Firestore) {  }

  currentUser$ = authState(this.auth);

  isLogged(){
    if(this.auth.currentUser)
    return true;
    else return false;
  }

  login(userdata: {email: string, password: string}){
    console.log(user)
    return from(signInWithEmailAndPassword(this.auth, userdata.email, userdata.password));
  }

  logout(){
    return from(this.auth.signOut());
  }

  signUp(email: string, password: string){
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }
 

}
