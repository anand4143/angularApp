import { Component,OnInit } from '@angular/core';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { Router } from '@angular/router';
import { RequestIdleComponent } from './dialog/request-idle/request-idle.component';
import { AuthService } from './common';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { MESSAGES } from './app.messages';
declare var google: any; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(
    private idle: Idle, 
    private keepalive: Keepalive,
    private dialogService : DialogService,
    private router: Router,
    private auth:AuthService
  ) {
    // sets an idle timeout of 10 minutes -- 5 seconds, for testing purposes.
    // idle.setIdle(10*60);
    // idle.setIdle(5);
    idle.setIdle(5*60*60);


    // sets a timeout period of 60 seconds(10 for testing). after 10 minutes of inactivity, the user will be considered timed out.
    idle.setTimeout(60);
    //idle.setTimeout(10);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      console.log(this.idleState);
      
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.reset();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
       
      if(!this.auth.isLoggedIn()) this.reset();
      else this.requestIdlePopup();
     
    });
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => {
      this.lastPing = new Date();
    });

    this.reset();
   } 

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
 
 requestIdlePopup(){
   let disposable =  this.dialogService.addDialog(RequestIdleComponent, {
     title:'Logging out', 
     message:  MESSAGES['TXT21']
     })
    .subscribe((confirm)=>{
      console.log("now i am here");      
    },
    (Close) => {
      console.log("you click close");
    });
 }

}
