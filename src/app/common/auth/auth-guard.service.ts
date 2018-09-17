import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
      private router: Router,
      private auth: AuthService
    ) { }

    canActivate(){
      return this.auth.canActivate()
      .map(loggedIn => {
        if(this.router.url.includes('login') || this.router.url.includes('register-new')) {
          this.auth.resetHasProgressed();
        }
        else this.auth.setHasProgressed();
        return true;
      })
      .catch(err => {
        this.auth.logout();
        this.router.navigate(['/']);
        return new Promise((resolve, reject) => resolve(err));
      });          
   }    

}