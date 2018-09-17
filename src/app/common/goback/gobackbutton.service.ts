import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class GobackbuttonService {

  constructor(
    private router: Router,
    private auth: AuthService
    ) { }
  gbf() {
    if(this.auth.getHasProgressed()) window.history.back();
    else this.router.navigate([this.auth.getRoute('home')]);
  }

}
