import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private router : Router,
    private auth : AuthService
  ) { }

  ngOnInit() {
  }

  changePassword() {
    console.log("change Password");
    this.router.navigate([this.auth.getRoute('password/change')]);
  }

}
