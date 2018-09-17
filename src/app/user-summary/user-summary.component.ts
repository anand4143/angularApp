import { Component, OnInit } from '@angular/core';
import { UserSummaryService } from './user-summary.service'
import { AuthService, GobackbuttonService } from '../common';
import { Router } from '@angular/router';
import { MESSAGES } from '../app.messages';
import { ApplyComponent } from '../dialog/apply/apply.component';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { RegisterIdentificationService } from '../register-identification/register-identification.service';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.css']
})
export class UserSummaryComponent implements OnInit {
  personalInfo: any = {};
  ssnInfo: any = {};
  companyInfo: any = {};
  ssnInfoIncomplete: boolean = false;
  empIncomplete: boolean = false;
  creditIncomplete: boolean = false;
  addressIncomplete: boolean = false;
  backgroundIncomplete: boolean = false;
  constructor(
    private userInfo: UserSummaryService,
    private auth: AuthService,
    private gbSrv: GobackbuttonService,
    private dialogService: DialogService,
    private router: Router,
    private identificationServ: RegisterIdentificationService,
  ) { }

  ngOnInit() {
    this.userInfo.resetInfo();
    this.getBasicInfo();
    this.getSSNInfo();
    this.getCompInfo();
    this.getFileStatus();
    this.getUserIdentityStatus();
    this.getCreditInfo();
    this.getAddressInfo();
    this.getBackgroundInfo();
    this.getPlaidTransactions();
    this.getw2();
    if(this.userInfo.getPopUp()){
      this.userInfo.resetPopUp();
      let disposable = this.dialogService.addDialog(ApplyComponent, {
        title: 'Applying...',
        message: MESSAGES['TXT05']
      }).subscribe(() => {
        console.log("this is kk summary page!");
      });
    }

  }

  getBasicInfo() {
    this.personalInfo.User_First_Name = 'Loading..';
    this.personalInfo.User_Last_Name = 'Loading..';
    this.personalInfo['Email_Address'] = 'Loading..';
    this.personalInfo['Contact_Num'] = 'Loading..';
    this.userInfo.getPersonalInfo()
      .subscribe((res) => {
        this.personalInfo = res;
      },
      (err) => {
        console.log(err);
      })
  }

  getSSNInfo() {
    this.ssnInfo.User_SSN = 'Loading..';
    this.userInfo.getSSNInfo()
      .subscribe((res) => {
        if (res.User_SSN) {
          var overlay = "******";
          res.User_SSN = overlay.concat(res.User_SSN.slice(6));
          this.ssnInfo = res;
        }
        else {
          // this.ssnInfo.User_SSN='Incomplete';
          this.ssnInfoIncomplete = true;
        }
      },
      (err) => {
        console.log(err);
      })
  }

  getCompInfo() {

    this.userInfo.getCompanyInfo()
      .subscribe((res) => {
        console.log("comp info : ", res);
        this.companyInfo['company.Company_Name'] = 'Loading..';
        if (res.length) {
          res.forEach(function (emp) {
            if (emp.Companies_Status == 1) {
              this.companyInfo = emp;
            }
          }, this)

        }
        else { this.empIncomplete = true; }
      },
      (err) => {
        //this.companyInfo['company.Company_Name']='Incomplete';
        console.log("comp info err: ", err);
        this.empIncomplete = true;
      })
  }

  getCreditInfo() {
    this.userInfo.getCreditInfo()
      .subscribe((res) => {
        if (!res) this.creditIncomplete = true;
      },
      (err) => {
        //this.companyInfo['company.Company_Name']='Incomplete';        
        this.creditIncomplete = true;
      })
  }
  getAddressInfo() {
    this.userInfo.getAddressInfo()
      .subscribe((res) => {
        console.log("response address==>", res);
        if (!res) this.addressIncomplete = true;
      },
      (err) => {
        //this.companyInfo['company.Company_Name']='Incomplete';        
        this.addressIncomplete = true;
      })
  }
  getBackgroundInfo() {
    this.userInfo.getBackgroundInfo()
      .subscribe((res) => {
        console.log("response address==>", res);
        if (!res) this.backgroundIncomplete = true;
      },
      (err) => {
        //this.companyInfo['company.Company_Name']='Incomplete';        
        this.backgroundIncomplete = true;
      })
  }

  getFileStatus() {
    //let files=[{type:"W2"},{type:"ID"},{type:"PS1"},{type:"PS2"},{type:"BS1"},{type:"BS2"},{type:"BK1"},{type:"BK2"}];  
    let files = [{ type: "W2" }, { type: "PS1" }, { type: "PS2" }, { type: "BS1" }, { type: "BS2" }, { type: "BK1" }, { type: "BK2" }];
    for (let i = 0; i < files.length; i++) {
      console.log("file type :", files[i].type);
      this.userInfo.getFileStatus(files[i].type)
        .subscribe((res) => {
          console.log("Files status:", res);
        },
        (err) => { });
    }
  }
  getUserIdentityStatus() {
    this.identificationServ.getDocumentVerificationStatus()
      .subscribe((data) => {
        if (data && data.status) {
          console.log("check identification user summary data:", data);
          console.log("check identification user summary data status:", data.status);
          this.userInfo.setStatusToComp("ID");
        } else {
          this.userInfo.resetComp("ID");
        }
      },
      (err) => {
        console.log(err);
        this.userInfo.resetComp("ID");
      })
  }

  getPlaidTransactions() {
    this.userInfo.getPlaidTransaction()
      .subscribe((res) => {
        console.log("response plaid transactions==>", res);
      },
      (err) => {
        //this.companyInfo['company.Company_Name']='Incomplete';        
        console.log(err);
      })
  }

  getw2(){
    this.userInfo.getW2()
     .subscribe((res)=>{
        console.log("response get w2==>",res);          
      },
      (err)=>{
        //this.companyInfo['company.Company_Name']='Incomplete';        
       console.log(err)
      })
  }

  goToLocation(box) {
    switch (box) {
      case 'UI': this.router.navigate([this.auth.getRoute('register-user')]); break;
      case 'ADC': this.router.navigate([this.auth.getRoute('register-ssn')]); break;
      case 'EMP': this.router.navigate(['user/register-employment']); break;
      case 'W2': this.router.navigate(['user/register-w2']); break;
      case 'CS': this.router.navigate(['user/register-credit']); break;
      case 'ID': this.router.navigate([this.auth.getRoute('register-identification')]); break;
      case 'PS': this.router.navigate(['user/register-pay']); break;
      case 'BNKS': this.router.navigate(['user/register-bank']); break;
      case 'AC': this.router.navigate(['user/address-check']); break;
      case 'BC': this.router.navigate(['user/background-check']); break;
      case 'BRKS': this.router.navigate([this.auth.getRoute('register-brokerage')]); break;

      //case 'BRKS' : this.router.navigate(['/broker/register-brokerage']); break;     
    }
  }

  gbf() {
    this.gbSrv.gbf();
  }
}
