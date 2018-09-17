import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common';
import { CONSTANTS } from '../app.constants';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constants = CONSTANTS;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    if(this.auth.isLoggedIn()) this.router.navigate([this.auth.getRoute('home')]);
    // this.auth.logout();
    this.auth.setEmailIdForForgetPwd('');
    console.log("email_id - Login", this.auth.getEmailIdForForgetPwd());
  }

  goToRegister(){
    this.auth.setUserType(this.constants.userRole.renter);
    //this.router.navigate(['/user/register-user']);
    this.router.navigate(['/user/register-new']);
  }
  
  goToLogin(type){
    // this.auth.setUserType(type);
    this.router.navigate(['/login/'+type]);
    // if(type == 1) this.router.navigate(['/user/login']);
    // else if(type == 2) this.router.navigate(['/broker/login']);
    // else this.router.navigate(['/landlord/login']);
  }
}
