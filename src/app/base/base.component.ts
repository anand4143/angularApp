import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService} from '../common';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  constructor(
    private router      : Router, 
    private route        : ActivatedRoute,
    private auth        : AuthService
  ) { }

  ngOnInit() {
    if(this.auth.isLoggedIn()) this.router.navigate([this.auth.getRoute('home')]);
    else this.router.navigate(['/']);
  }

}
