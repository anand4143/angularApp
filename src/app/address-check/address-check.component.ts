import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GobackbuttonService } from '../common';
import { UserSummaryService } from '../user-summary';
import { MESSAGES } from '../app.messages';
import { DialogService } from "ng2-bootstrap-modal";
import { AddressCheckService } from './address-check.service';
import { WindowRefService } from '../common/window/window-ref.service';
import { SuccessComponent } from '../dialog/success/success.component';
import { ConfirmComponent } from '../dialog/confirm/confirm.component';

@Component({
  selector: 'app-address-check',
  templateUrl: './address-check.component.html',
  styleUrls: ['./address-check.component.css']
})
export class AddressCheckComponent implements OnInit {

  error = '';
  isDone = false;
  nativeWindow: any;
  addressBut: boolean = false;
  ssnBut: boolean = false;
  documentBut: boolean = false;
  addCheckFrm: FormGroup;
  addCheckMdl: any = {};


  constructor(
    private gbSrv: GobackbuttonService,
    private router: Router,
    private auth: AuthService,
    private dialogService: DialogService,
    private winRef: WindowRefService,
    private addressService: AddressCheckService,
    private usrSrv: UserSummaryService,
    private frmbuilder: FormBuilder
  ) {
    this.nativeWindow = winRef.getNativeWindow();
    this.addCheckFrm = frmbuilder.group({
      'Gender': [null, Validators.required]
    })
    this.addCheckFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.usrSrv.resetProgress();
    this.getCompleteDetails();
    //console.log("addCheckMdl", this.addCheckMdl);
    this.fetchGender();
  }

  goToIdCheck() {
    this.router.navigate([this.auth.getRoute('background-check')]);
  }

  checkAddress() {
    this.addressBut = true;
    this.addressService.addressCheck()
      .subscribe((data) => {
        this.getCompleteDetails();
      },
      (err) => {
        this.profileCompletionDialog(err.code);
      })
  }

  checkSSN() {
    var genderObj = {
      "User_Gender": this.addCheckMdl.User_Gender
    }
    this.ssnBut = true;  
    console.log("gender==>", this.addCheckMdl.User_Gender);
    this.addressService.ssnCheck(genderObj)
      .subscribe((data) => {
        //console.log('checkSSN', data);
        this.getCompleteDetails();
      },
      (err) => {
        this.profileCompletionDialog(err.code);
      })
  }

  checkDocument() {
    this.documentBut = true;
    this.addressService.documentCheck()
      .subscribe((data) => {
        this.getCompleteDetails();
      },
      (err) => {
        if (err.code == 'CCAC01') {
          this.profileCompletionDialog(err.code);
        }
        else {
          this.incorrectResponseDialog(err.code)
        }
      })
  }

  gbf() {
    this.gbSrv.gbf();
  }

 

  openNewWindow() {
    console.log("To be implemented");
    this.router.navigate(['address-report/' + this.auth.getUserId()]);
    
  }



  getCompleteDetails() {
    this.addressService.getAll()
      .subscribe((data) => {
        console.log("ssn data:",data);
       
        if(data){
          if (data.status) this.getReport('ssn');
        }
      }, (err) => {
        console.log(err);
      })
  }

  getReport(type) {
    this.addressService.getReport(type, this.auth.getUserId())
      .subscribe((data) => {
        //console.log("report data:",data);
      },
      (err) => {
        console.log(err);
      })
  }

  profileCompletionDialog(code) {
    var msg = '';
    if (code == 'CCAC02') msg = MESSAGES.TXT10;
    if (code == 'CCAC04') msg = MESSAGES.TXT11;
    if (code == 'CCAC06') msg = MESSAGES.TXT15;
    if (code == 'CCAC01') msg = MESSAGES.TXT10;
    if (code == 'CCAC07') msg = MESSAGES.TXT16;
    if (code == 'CCAC05') msg = MESSAGES.TXT11;
    else{
      msg =  MESSAGES.CCU01
    }
    let disposable = this.dialogService.addDialog(SuccessComponent, {
      message: msg
    })
      .subscribe((res) => {
        if (res) {
          if (code == 'CCAC06') this.router.navigate([this.auth.getRoute('register-identification')]);
          else {
            this.router.navigate([this.auth.getRoute('register-user')]);
          }
        }
      });
  }

  incorrectResponseDialog(code) {
    var msg = '';
    if (code == 'CCAC05') {
      msg = MESSAGES.TXT14;
      let disposable = this.dialogService.addDialog(ConfirmComponent, {
        message: msg
      })
        .subscribe((isConfirmed) => {
          if (isConfirmed) {
            this.uploadOnfido();
          } else {
            console.log("Terminated");
          }
        });
    }

  }

  uploadOnfido() {
    this.addressService.uploadOnfido()
      .subscribe((data) => {
        this.getCompleteDetails();
      },
      (err) => {
        this.profileCompletionDialog(err.code);
      })
  }

  fetchGender() {
    this.addressService.getGender()
      .subscribe((data) => {
        this.addCheckMdl.User_Gender = data.User_Gender;
      }, (err) => {
        console.log(err)
      })
  }
}