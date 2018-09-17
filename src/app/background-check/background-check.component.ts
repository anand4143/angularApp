import {Component, OnInit,ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GobackbuttonService } from '../common';
import { UserSummaryService } from '../user-summary';
import { MESSAGES } from '../app.messages';
import { DialogService } from "ng2-bootstrap-modal";
import { BackgroundCheckService } from './background-check.service';
import { WindowRefService } from '../common/window/window-ref.service';
import { SuccessComponent } from '../dialog/success/success.component';
import { ConfirmComponent } from '../dialog/confirm/confirm.component';

@Component({
  selector: 'app-background-check',
  templateUrl: './background-check.component.html',
  styleUrls: ['./background-check.component.css']
})
export class BackgroundCheckComponent implements OnInit {

  error         = '';
  //nativeWindow  : any;
  backgroundBut : boolean ;
  constructor(
    private gbSrv : GobackbuttonService,
    private router : Router,
    private auth : AuthService,
    private dialogService : DialogService,
    //private winRef        : WindowRefService,  
    private bgCheckService: BackgroundCheckService,
    private usrSrv : UserSummaryService
  ) { 
    //this.nativeWindow = winRef.getNativeWindow();
  }

  ngOnInit() {
    this.bgCheckService.resetAll();   
    this.getActiveOrder(); 
  }

  getActiveOrder(){
    this.bgCheckService.getActiveOrder()
    .subscribe((data)=>{        
      console.log(data);   
    },
    (err)=>{
      console.log(err);
    })
  }

  getOrder(){
    this.bgCheckService.getOrder(this.auth.getUserId())
    .subscribe((data)=>{        
      console.log(data);   
    },
    (err)=>{
      console.log(err);
    })
  }

  runCheck(){
    this.backgroundBut = true;
    this.bgCheckService.runCheck()
    .subscribe((data)=>{        
      this.getActiveOrder();
    },
    (err)=>{
      this.profileCompletionDialog(err.code)
    })
  }

  gbf() {
    this.gbSrv.gbf();
  }  

   goToReport(){    
    this.router.navigate(['background-report/' +this.auth.getUserId()]);
   }

   profileCompletionDialog(code){
     var msg='';
     console.log("In dialog invoker",code);
     if(code == 'CCBC01') msg = MESSAGES.TXT11;
     if(code == 'CCBC02') msg = MESSAGES.TXT10;
     if(code == 'CCBC03') msg = MESSAGES.TXT17;   
     else msg= MESSAGES.TXT33;  
     let disposable = this.dialogService.addDialog(SuccessComponent, {      
      message: msg })
      .subscribe((res)=>{             
        if(res) { 
          if(code == 'CCBC03')this.router.navigate([this.auth.getRoute('register-employment')]);
          else{
            this.router.navigate([this.auth.getRoute('register-user')]);
          }          
        }
      });
   }

   goToSummary(){
     this.router.navigate(['user/usersummary']);
   }

}
