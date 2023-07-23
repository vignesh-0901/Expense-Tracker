import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PERSONAL EXPENSE TRACKER';
  mail:any;
  
  constructor(public auth: AuthenticationService, private router: Router,){
    
  }
  
  checkLogged(){
    return this.auth.isLogged();
  }
  
  logout(){
    this.auth.logout().subscribe(()=>{
      this.router.navigate(['']);
    });
  }
}
