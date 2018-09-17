import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CONSTANTS } from '../../app.constants';
import { Router } from '@angular/router';
import {Idle} from '@ng-idle/core';
import { AuthService } from '../../common';
@Component({
  selector: 'app-request-idle',
  templateUrl: './request-idle.component.html',
  styleUrls: ['./request-idle.component.css']
})
export class RequestIdleComponent extends DialogComponent {
private timeOutCounter;
 constructor( 
        dialogService : DialogService,
        private idle  : Idle,
        private router: Router,
        private auth:AuthService
 ){  
    super(dialogService);
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.timeOutCounter = countdown;
      if(countdown == 1) this.Close();
    });

  }

  Close(){   
      this.close();
      this.auth.logout();
      this.router.navigate(['/']);
  }

  confirm() {
    this.close();
  }
 

}
