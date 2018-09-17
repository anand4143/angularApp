import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GobackbuttonService } from '../common';
import { RegisterCreditService } from './register-credit.service';
import { UserSummaryService } from '../user-summary';
import { DialogService } from "ng2-bootstrap-modal";
import { MESSAGES } from '../app.messages';
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { SuccessComponent } from '../dialog/success/success.component';
//import { WindowRefService } from '../common/window/window-ref.service';

@Component({
  selector: 'app-register-credit',
  templateUrl: './register-credit.component.html',
  styleUrls: ['./register-credit.component.css']
})
export class RegisterCreditComponent implements OnInit {
  error = '';
  questionSet = [];
  answerSet = [];
  isUpdated = false;
  //nativeWindow       : any;
  isSpinner: boolean = false;
  creditBut: boolean = false;
  constructor(
    private gbSrv: GobackbuttonService,
    private router: Router,
    private auth: AuthService,
    private dialogService: DialogService,
    private regCredService: RegisterCreditService,
    private usrSrv: UserSummaryService,
    //private winRef          : WindowRefService
  ) {
    //this.nativeWindow = winRef.getNativeWindow();
  }

  ngOnInit() {
    this.isSpinner = true;
    this.usrSrv.getCreditInfo().subscribe(
      (res) => {
        console.log("credit res==>", res);
        if (res == null) this.isSpinner = false;
        if (res) {
          if (res.status == false) this.isSpinner = false;
        }
        console.log("this.isSpinner==>", this.isSpinner);
      }, (err) => {
        console.log("credit err==>", err);
      });

    this.regCredService.resetAll();
    this.usrSrv.resetProgress();
    this.getStatus();
    console.log("On init", this.regCredService.getAuthStatus());
  }

  getScore() {
    this.creditBut = true;
    this.answerSet = [];
    this.regCredService.saveCreditData()
      .subscribe((data) => {
        this.questionSet = this.regCredService.getQuestionSet();
        if (this.auth.getUserId()) this.renderDialog(this.questionSet[0], 0, this.questionSet.length);
      },
      (err) => {
        var msg = '';
        console.log("Error", err);
        if (err.code == 'CCC01') {
          msg = MESSAGES.TXT10;
          this.profileCompletionDialog(msg);
        } else if (err.code == 'CCC06') {
          msg = MESSAGES.TXT11;
          this.profileCompletionDialog(msg);
        }
        else if (err.code == 'CCC03'|| err.code == 'CCC08' || err.code == 'CCC02') {
          msg = MESSAGES.TXT11;
          this.profileCompletionDialog(msg);
        }
      })
  }

  creditResult() {
    this.router.navigate([this.auth.getRoute('address-check')]);
  }

  gbf() {
    // this.gbSrv.gbf();
    this.router.navigate([this.auth.getRoute('usersummary')]);
  }

  renderDialog(question, index, totalQuestions) {
    if (index < this.questionSet.length) {
      question.total = this.questionSet.length;
      question.current = Number(index) + 1;
      let disposable = this.dialogService.addDialog(SuccessComponent, {
        title: MESSAGES['HDR02'],
        message: question
      })
        .subscribe((ans) => {
          console.log(ans);
          if (ans) {
            this.answerSet.push(ans);
            if (this.auth.getUserId()) this.renderDialog(this.questionSet[index + 1], index + 1, this.questionSet.length)
          }
        });
    } else {
      console.log(this.answerSet);
      console.log("Finished");
      this.regCredService.sendAnswers(this.answerSet)
        .subscribe((res) => {
          console.log("Success");
          console.log("Inside Component", this.regCredService.getCreditInfoId())
          this.router.navigate(['creport-authorize/' + this.regCredService.getCreditInfoId()]);
        }, (err) => {
          console.log(err);
          if (err.code == 'CCC04') {
            var msg = MESSAGES.TXT12;
            this.incorrectResponseDialog(msg);
          }
          else if (err.code == 'CCC06') {
            var msg = MESSAGES.TXT18;
            this.profileCompletionDialog(msg);
          }
          else if (err.code == 'CCC07') {
            var msg = MESSAGES.TXT19;
            this.profileCompletionDialog(msg);
          }
        })
    };
  }

  profileCompletionDialog(msg) {
    let disposable = this.dialogService.addDialog(SuccessComponent, {
      message: msg
    })
      .subscribe((res) => {
        if (res) {
          this.router.navigate([this.auth.getRoute('register-user')]);
        }
      });
  }

  incorrectResponseDialog(msg) {
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      message: msg
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.getScore();
        } else {
          console.log("Terminated");
        }
      });
  }

  //  getReport(){    
  //    this.regCredService.getReport()
  //     .subscribe((data)=>{
  //       this.isSpinner = false;
  //       if(this.regCredService.getCreditScore() && !this.regCredService.getCreditStatus()){
  //         this.getStatus();
  //       }       
  //     },
  //     (err)=>{ 
  //       this.isSpinner = false;   
  //       if(err.code =='CCC05'){
  //          var msg =MESSAGES.TXT13;
  //          this.incorrectResponseDialog(msg);
  //       }

  //     })
  //  }

  getStatus() {
    this.isSpinner = true;
    this.regCredService.getStatus()
      .subscribe((credit) => {
        console.log("After get status", this.regCredService.getAuthStatus());
        if (credit) {
          if (credit.status) {
            console.log('credit status==> ', credit.status);
            // this.getReport();   
            this.isSpinner = false;
          }
        }
      },
      (err) => {
        this.error = err.msg;
      })
  }

  openNewWindow() {
    //  var Url='user/credit-report';
    //  this.nativeWindow.open(Url, '_blank', 'location=yes,scrollbars=yes,status=yes')
    this.router.navigate(['credit-report/' + this.auth.getUserId()]);
  }

  goToTC() {
    this.router.navigate(['creport-authorize/' + this.regCredService.getCreditInfoId()]);
  }

}
