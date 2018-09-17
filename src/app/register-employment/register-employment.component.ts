import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, EqualValidator, PasswordValidator, PhoneValidator, EmailValidator, GobackbuttonService } from '../common';
import { MESSAGES } from '../app.messages';
import { RegisterEmploymentService } from './register-employment.service';
import { UserSummaryService } from '../user-summary';
import { SuccessComponent } from '../dialog/success/success.component';
import { RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
declare var Plaid:any

@Component({
  selector: 'app-register-employment',
  templateUrl: './register-employment.component.html',
  styleUrls: ['./register-employment.component.css']
})
export class RegisterEmploymentComponent implements OnInit {
  rgempnMdl: any = {};
  error = '';
  emps=[];
  rgempFrm: FormGroup; 
  currentEmp:{};
  errorMsg: string = '';
  errorVar: boolean = false; 
  options=[{value:1,text:'Login Using Plaid'},{value:2,text:'Enter Manually'}]
  constructor(
    private router: Router,
    private auth: AuthService,
    private frmbuilder: FormBuilder,
    private gbSrv: GobackbuttonService,
    private empSrv: RegisterEmploymentService,
    private usrSrv: UserSummaryService,
    private dialogService: DialogService,
  ) {
    this.rgempFrm = frmbuilder.group({  
      'EmploymentOption': [0]  ,    
      'Company_Name'       : [null,Validators.required],
      'Company_City'       : [null,Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
      'Company_Region'     : [null,Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
      'Company_Country'    : [null,Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
    })
    this.rgempFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.rgempnMdl.EmploymentOption=0;
    this.usrSrv.resetProgress();    
    if (this.auth.isLoggedIn()) {
      this.initializeEmp();
    }
  }

  

  saveEmpData() {
    this.errorMsg = '';
    this.empSrv.saveEmpData(this.rgempnMdl)
      .subscribe(
      (user) => {
        this.errorVar = false;
        this.usrSrv.setStatusToComp('EMP');
        let disposable = this.dialogService.addDialog(RegisterDialogComponent, {
          title: this.auth.getName(),
          message: MESSAGES['TXT22']
        })
          .subscribe((confirm) => {
            console.log("Inside register user");
            this.router.navigate([this.auth.getRoute('usersummary')]);
          },
          (close) => {
            console.log("you click close");
          });
      },
      (err) => {
        this.errorVar = true;
        this.errorMsg = MESSAGES[err['code']];
      }
      )
  }  

  empOptionChange(){    
    if(this.rgempnMdl.EmploymentOption   == '1'){
      this.initializePlaid();
    }
  }

  gbf() {
    this.gbSrv.gbf();
  }

  initializeEmp(){
    // this.empSrv.getUserEmpData()
    // .subscribe((user) => {
    //   console.log("After Login seting company id:", user);
    //   if (user) {
    //     if(user.length)this.currentEmp=user;          
    //     this.emps=user;
    //     console.log(this.emps);
    //   }
    // })

    this.empSrv.getUserEmpData()
      .subscribe((emps) => {
        if(emps){
          if(emps.length){
              console.log('emps',emps);
              this.currentEmp=emps;
              this.emps=emps;
              emps.forEach(function(emp){
                if(emp.Companies_Status == 1){ 
                  console.log(emp);                   
                  this.rgempnMdl['Company_Name'] = emp['company.Company_Name'];
                  this.rgempnMdl['Company_City'] = emp['company.Company_City'];
                  this.rgempnMdl['Company_Region'] = emp['company.Company_State'];
                  this.rgempnMdl['Company_Country'] = emp['company.Company_Country'];             
                }
              },this)
          }
        }                 
      })
  }

  errorDialog(msg) {
    let disposable = this.dialogService.addDialog(SuccessComponent, {
      message: msg
    })
    .subscribe((res) => {
      if (res) {
        console.log('Closed')
      }
    });
  }

  initializePlaid(){
    let regEmpComp= this;
    var linkHandler = Plaid.create({
      env: 'sandbox',
      apiVersion: 'v2',
      clientName: '5804fd4af5c9c9795f46a624',
      key: 'b37f57f5267b03ae3f110e4926ebb3',
      product: 'auth',
      onLoad: function() {
        // The Link module finished loading.
        console.log('Loading..')
      },
      onSuccess: function(public_token, metadata) {
        regEmpComp.rgempnMdl.EmploymentOption=0;
        // Send the public_token to your app server here.
        // The metadata object contains info about the institution the
        // user selected and the account ID, if selectAccount is enabled.
        console.log('Success');
        console.log('public_token',public_token);
        console.log('metadata',metadata);
        regEmpComp.empSrv.setAccessToken(public_token)
        .subscribe((data)=>{
          console.log(data);
          regEmpComp.initializeEmp();
        },(err)=>{
          console.log(err);
          if(err.code == 'CCU18')regEmpComp.errorDialog(MESSAGES['TXT35'])
        })
      },
      onExit: function(err, metadata) {
        console.log('Coming out..');
        regEmpComp.rgempnMdl.EmploymentOption=0;
        // The user exited the Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
        }
        // metadata contains information about the institution
        // that the user selected and the most recent API request IDs.
        // Storing this information can be helpful for support.
      }
    });
    linkHandler.open();
  }
  
}
