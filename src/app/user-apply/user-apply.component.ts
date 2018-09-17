import { Component, OnInit,ViewChild } from '@angular/core';
import { BookmarkService } from '../bookmark/bookmark.service';
import { BookmarkApplicationService,ConfigService,FileService ,EqualValidator,PasswordValidator,
  PhoneValidator,EmailValidator,PhonenumberPipe,AuthService, GobackbuttonService } from '../common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VerificationComponent } from '../dialog/verification/verification.component';
import { CONSTANTS } from '../app.constants';
import { UserSummaryService } from '../user-summary';

@Component({
  selector: 'app-user-apply',
  templateUrl: './user-apply.component.html',
  styleUrls: ['./user-apply.component.css']
})
export class UserApplyComponent implements OnInit {
  verificationArray: any = [];
  userVerificationArray: any=[];
  constants = CONSTANTS;
  

  @ViewChild(SidebarComponent)
  sidebar:SidebarComponent

  constructor(
    private router      : Router, 
    private bkmrk       : BookmarkService,
    private bkmrkAppSrv : BookmarkApplicationService,
    private route       : ActivatedRoute,
    private config      : ConfigService,
    private fileSrv     : FileService,
    private auth        : AuthService,
    private gbSrv       : GobackbuttonService,
    private userSmr     : UserSummaryService
  ) { }

  ngOnInit() {
     this.route.params.subscribe((params: Params) => {
      console.log("URL BookmarkID from user apply component ==> ",params['bkmrkId']);
        if(params['bkmrkId']) {
          this.bkmrkAppSrv.setSelectedBookmarkId(params['bkmrkId']);
          this.bkmrk.loadBookmark(params['bkmrkId']);
        }        
      });
      this.getApplication();
    //this.bkmrk.initCurrentBookmark();   
    //this.bkmrkAppSrv.setSelectedBookmarkId(this.bkmrk.getCurrentBookmark()['Bookmark_ID']);
    //this.bkmrk.loadBookmark(this.bkmrk.getCurrentBookmark()['Bookmark_ID']);
  
  }

  getApplication(){
    this.bkmrkAppSrv.getApplication()
    .subscribe((appid)=>{  
      this.bkmrkAppSrv.getMasterVerificationItems()
      .subscribe(masterData=>{
        this.verificationArray = masterData;
        this.bkmrkAppSrv.getUserVerificationItems()
        .subscribe(userData=>{ 
          this.userVerificationArray = userData;       
          this.verificationArray.forEach(this.getUserData, this)
          console.log("verifiaction array:",this.verificationArray);
        })
      })
      
    },
    (err) => {
      console.log("this is error",err);
      this.router.navigate([this.auth.getRoute('home')]);
    });
  }

  getUserData(verificationItem, index) {
    console.log("verificationItem:",verificationItem);
    //console.log("current Obj:",index);
    //verificationItem.status = 0; // 0-NotVerified, 1-Incomplete, 2-OnHold, 3-Completed 
    verificationItem.Application_Verification_Status = this.constants.verificationStatus.notReviewed;
    verificationItem.Application_Verification_Cost = 0;
    
    switch(verificationItem.Verification_Name){
      case 'UI'   : this.addUserInfo(verificationItem); break;
      case 'ID'   : this.addId(verificationItem); break;
      case 'EV'   : this.evictionCheck(verificationItem); break;
      case 'BACC' : this.bankAccountBalance(verificationItem); break;
      case 'EMP'  : this.employmentCheck(verificationItem); break; // do
      case 'CRI'  : this.criminalCheck(verificationItem); break;
      case 'PS'   : this.paystub(verificationItem); break; // do
      case 'TF'   : this.taxForms(verificationItem); break;
      case 'CS'   : this.creditScore(verificationItem); break;
      case 'BRKS' : this.brokerageStatement(verificationItem); break;
      case 'BNKS' : this.bankStatement(verificationItem); break; // do
      case 'ADC'  : this.addressCheck(verificationItem); break;
    }
    console.log("this.userVerificationArray:",this.userVerificationArray);
    this.userVerificationArray.forEach(function (item, index) {
      this.updateStatus(verificationItem, item, index)
    }, this);
  }

  updateStatus(verifItem, userVerificationItem, index){
    //verifItem.Application_Verification_Cost = userVerificationItem['Application_Verification_Cost'];
    console.log("verifItem 4:",verifItem.Application_Verification_Cost);
    if(verifItem.Master_Verification_ID == userVerificationItem.Master_Verification_ID){
      verifItem.Application_Verification_Cost = userVerificationItem['Application_Verification_Cost'];
      verifItem.Application_Verification_Status = userVerificationItem.Application_Verification_Status;
    }
  }

  addUserInfo(item){
    //this.bkmrkAppSrv.getRenterPersonalInfo()
    this.userSmr.getPersonalInfo()
    .subscribe((info)=> {
      console.log("User Personal Info:",info);
      item.name = info.User_First_Name + ' ' + info.User_Last_Name;
    });
    //this.bkmrkAppSrv.getRenterSSNInfo()
    this.userSmr.getSSNInfo()
    .subscribe((info)=> {
       console.log("User SSN Info:",info);
      item.dob = info.User_DOB;
      item.ssn = info.User_SSN;
    })
  }

  addId(item){
    //this.bkmrkAppSrv.isRenterfileExists('ID')
    this.userSmr.isRenterfileExists('ID')
    .subscribe((result)=>{
      item.userfile   = result.File_Path;
      item.fileId1    = result.File_ID;
      item.fileName1  = result.File_Original_Name
    });
  }

  evictionCheck(item){
    item.text1 = item.Verification_Description;
    item.showTick = true;
  }

  bankAccountBalance(item){
    item.text1 = 'BANK ACCOUNT BALANCE';
    item.text2 = '$100,000.00';
  }
  employmentCheck(item){
    item.text1 = 'EMPLOYMENT CHECK';
    item.text2 = 'INCOME CHECK';
    item.showTick = true;
    item.showIncomeTick = true;
  }
  criminalCheck(item){
    item.text1 = 'CRIMINAL CHECK';
    item.showTick = true;
  }

  paystub(item){  
    item.text1 = 'PAY STUBS';
    item.counterText = ' SUBMITTED'
    item.fileCounter = 0;  
    //this.bkmrkAppSrv.isRenterfileExists('PS1')
    this.userSmr.isRenterfileExists('PS1')
    .subscribe(
      ps1info => {
        if(ps1info) {
          item.fileCounter = item.fileCounter + 1;
          item.fileId1 = ps1info.File_ID;
          item.fileName1 = ps1info.File_Original_Name;
        }

      },
      error => {
        console.log(error);
      }
      );      
    //this.bkmrkAppSrv.isRenterfileExists('PS2')
    this.userSmr.isRenterfileExists('PS2')
    .subscribe(
      ps2info => {
        if(ps2info){
          //item.text1 = 'PAY STUBS:'
          item.fileCounter = item.fileCounter + 1;
          item.fileId2 = ps2info.File_ID;
          item.fileName2 = ps2info.File_Original_Name
        }
      });
  }

  taxForms(item){
    item.text1 = 'TAX FORM:';
    item.text2 = '1 SUBMITTED';
  }

  creditScore(item){
    item.text1 = 'CREDIT SCORE:';
    item.text2 = ' 450';
  }

  brokerageStatement(item){
      item.text1 = 'BROKERAGE STATEMENT:';
      item.text2 = '1 SUBMITTED';
   
  }

  bankStatement(item){
    item.fileCounter = 0; 
    item.text1 = 'BANK STATEMENT:';
    item.counterText = ' SUBMITTED'
    //this.bkmrkAppSrv.isRenterfileExists('BS1')
    this.userSmr.isRenterfileExists('BS1')
    .subscribe(
      ps1info => {
        if(ps1info) {
          item.fileCounter = item.fileCounter + 1;
          item.fileId1 = ps1info.File_ID;
          item.fileName1 = ps1info.File_Original_Name
        }
      });      
    //this.bkmrkAppSrv.isRenterfileExists('BS2')
    this.userSmr.isRenterfileExists('BS2')
    .subscribe(
      ps2info => {
        if(ps2info){           
          item.fileCounter = item.fileCounter + 1;
          item.fileId2 = ps2info.File_ID;
          item.fileName2 = ps2info.File_Original_Name
        }
      });
  }
  
  addressCheck(item){
      item.text1 = 'ADDRESS CHECK';
      item.showTick = true;
  }

  isReviewed(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.notReviewed);
  }

  isApproved(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.approved);
  }

  isInProcess(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.inProcess);
  }

  isIncomplete(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.inComplete);
  }

  goToLocation(box){

    switch(box.Verification_Name){
      case 'UI'   : this.router.navigate(['user/register-user']); break;
      case 'ID'   : this.router.navigate(['user/register-identification']); break;
      case 'EV'   : console.log("EV check"); break;
      case 'BACC' : console.log("Bank ACCOUNT info"); break;
      case 'EMP'  : this.router.navigate(['user/register-employment']); break; 
      case 'CRI'  : console.log("Criminal check"); break;
      case 'PS'   : this.router.navigate(['user/register-pay']); break; 
      case 'TF'   : console.log("Tax Forms"); break;
      case 'CS'   : this.router.navigate(['user/register-credit']); break;
      case 'BRKS' : console.log("Brokerage Statement"); break;
      case 'BNKS' : this.router.navigate(['user/register-bank']); break; 
      case 'ADC'  : this.router.navigate(['user/register-ssn']); break;
    }

  }

  scheduleView(){

  }

  gbf() {
    this.gbSrv.gbf();
  }
}

