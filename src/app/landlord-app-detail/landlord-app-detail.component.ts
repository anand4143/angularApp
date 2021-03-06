import { Component, OnInit,ViewChild } from '@angular/core';
import { BookmarkService } from '../bookmark/bookmark.service';
import { BookmarkApplicationService,ConfigService,FileService ,EqualValidator,
  PasswordValidator,PhoneValidator,EmailValidator,PhonenumberPipe,AuthService,GobackbuttonService } from '../common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VerificationComponent } from '../dialog/verification/verification.component';
import { DialogService } from "ng2-bootstrap-modal";
import { CONSTANTS } from '../app.constants';
//import { RegisterPayInfoService} from '../register-pay-info/register-pay-info.service';

@Component({
  selector: 'app-landlord-app-detail',
  templateUrl: './landlord-app-detail.component.html',
  styleUrls: ['./landlord-app-detail.component.css']
})
export class LandlordAppDetailComponent implements OnInit {
  popupBody: any = {}; 
  verificationArray: any = [];
  userVerificationArray: any=[];
  constants = CONSTANTS;

  @ViewChild(SidebarComponent)
  sidebar:SidebarComponent

  constructor(
    private router: Router, 
    private bkmrk:  BookmarkService,
    private bkmrkAppSrv:  BookmarkApplicationService,
    private route:  ActivatedRoute,
    private config: ConfigService,
    private fileSrv: FileService,
    private dialogService : DialogService,
    private auth : AuthService,
    private gbSrv: GobackbuttonService,
    //private regPayInfo:RegisterPayInfoService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params['bkmrkId']);
        if(params['bkmrkId']){
          this.bkmrk.loadNewBookmark(params['bkmrkId']).subscribe();
          this.bkmrkAppSrv.setSelectedBookmarkId(params['bkmrkId']);
          this.bkmrkAppSrv.setBookmarkRenterInfo(params['bkmrkId']);
          this.bkmrkAppSrv.getBrokerDetails(params['bkmrkId']);
        }
        this.getApplication();
      });     
  }

  getApplication(){
    this.bkmrkAppSrv.getApplication()
    .subscribe((appid)=>{
      this.bkmrkAppSrv.getMasterVerificationItems()
        .subscribe(masterData=>{
          //console.log(masterData)
          this.verificationArray = masterData;
          this.bkmrkAppSrv.getUserVerificationItems()
          .subscribe(userData=>{
            //console.log("masterData",masterData); 
            //console.log("userData",userData); 
            this.userVerificationArray = userData;        
            this.verificationArray.forEach(this.getUserData, this)
          })
        })
    },
    (err) => {
      console.log("this is error",err);
      this.router.navigate([this.auth.getRoute('home')]);
    });
  }

  getUserData(verificationItem, index) {
    //verificationItem.status = 0; // 0-NotVerified, 1-Incomplete, 2-OnHold, 3-Completed 
    verificationItem.Application_Verification_Status = this.constants.verificationStatus.notReviewed;
    verificationItem.Application_Verification_Cost = 0;
    
    // switch(verificationItem.Verification_Name){
    //   case 'UI'   : this.addUserInfo(verificationItem); break;
    //   case 'ID'   : this.addId(verificationItem); break;
    //   case 'EV'   : this.evictionCheck(verificationItem); break;
    //   case 'BACC' : this.bankAccountBalance(verificationItem); break;
    //   case 'EMP'  : this.employmentCheck(verificationItem); break; // do
    //   case 'CRI'  : this.criminalCheck(verificationItem); break;
    //   case 'PS'   : this.paystub(verificationItem); break; // do
    //   case 'TF'   : this.taxForms(verificationItem); break;
    //   case 'CS'   : this.creditScore(verificationItem); break;
    //   case 'BRKS' : this.brokerageStatement(verificationItem); break;
    //   case 'BNKS' : this.bankStatement(verificationItem); break; // do
    //   case 'ADC'  : this.addressCheck(verificationItem); break;
    // }
    
    switch(verificationItem.Verification_Name){
      case 'UI'   : this.addUserInfo(verificationItem); break;
      case 'EMP'  : this.employmentCheck(verificationItem); break; // do        
      case 'W2'   : this.W2Check(verificationItem); break;  
      case 'ID'   : this.addId(verificationItem); break;       
      case 'PS'   : this.paystub(verificationItem); break; // do     
      case 'BNKS' : this.bankStatement(verificationItem); break; // do 
      case 'CS'   : this.creditScore(verificationItem); break;      
      case 'ADC'  : this.addressCheck(verificationItem); break;
      case 'BGC'  : this.backgroundCheck(verificationItem); break; // do
     
    }

    this.userVerificationArray.forEach(function (item, index) {
      this.updateStatus(verificationItem, item, index)
    }, this);
  }

  updateStatus(verifItem, userVerificationItem, index){
    verifItem.Application_Verification_Cost = userVerificationItem.Application_Verification_Cost;
    if(verifItem.Master_Verification_ID == userVerificationItem.Master_Verification_ID){
      verifItem.Application_Verification_Status = userVerificationItem.Application_Verification_Status;
    }
  }

  addUserInfo(item){
    this.bkmrkAppSrv.getRenterPersonalInfo()
    .subscribe((info)=> {
      item.name = info.User_First_Name + ' ' + info.User_Last_Name;
    });
    this.bkmrkAppSrv.getRenterSSNInfo()
    .subscribe((info)=> {
      item.dob = info.User_DOB;
      item.ssn = info.User_SSN;
    })
  }

  addId(item){
    this.bkmrkAppSrv.isRenterfileExists('ID')
    .subscribe((result)=>{
     // console.log("identity:",result);
      // item.File_ID = result.File_ID;
      // item.File_Original_Name = result.File_Original_Name;
      // item.File_Path = result.File_Path;
      item.userfile =  result.File_Path;
      //console.log("user id file:",item.userfile);
      item.fileId1 = result.File_ID;
      item.fileName1 = result.File_Original_Name
    });
  }

  backgroundCheck(item){
    item.text1 = 'BACKGROUND CHECK';    
  }

  W2Check(item){
    item.text1 = 'W2';
    item.showTick = true;
   }

  evictionCheck(item){
    //item.text1 = 'EVICTION CHECK ';
    //item.text2 = '<i class="fa fa-check" aria-hidden="true"></i>';
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
    this.bkmrkAppSrv.isRenterfileExists('PS1')
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
    this.bkmrkAppSrv.isRenterfileExists('PS2')
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
    item.text1 = 'CREDIT CHECK';
    item.text2 = ' 450';
  }

  brokerageStatement(item){
      item.text1 = 'BROKERAGE STATEMENT';
      item.text2 = '1 SUBMITTED';
   
  }

  bankStatement(item){
    item.fileCounter = 0; 
    item.text1 = 'BANK STATEMENT';
    item.counterText = ' SUBMITTED'
    this.bkmrkAppSrv.isRenterfileExists('BS1')
    .subscribe(
      ps1info => {
        if(ps1info) {
          item.fileCounter = item.fileCounter + 1;
          item.fileId1 = ps1info.File_ID;
          item.fileName1 = ps1info.File_Original_Name
        }
      });      
    this.bkmrkAppSrv.isRenterfileExists('BS2')
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

  updateVerificationStatus(objectToVerify:any){
    console.log("objectToVerify: ",objectToVerify);
    //do a foreach on this.userVerificationArray
    //connect using this.userVerificationArray.Master_Verification_ID == objectToVerify.Master_Verification_ID
    //if found update objectToVerify.status = this.userVerificationArray.Application_Verification_Status
  }

  verificationPopup(box){
    //console.log("box: ",box);
    let disposable = this.dialogService.addDialog(VerificationComponent, {
    verificationItem:box})
    .subscribe(()=>{
      
    });
  }

  isApproved(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.approved);
  }

  gbf() {
    this.gbSrv.gbf();
  }
  
  approveAppliction(){
    var data={
      Bookmark_ID:this.bkmrkAppSrv.getSelectedBookmarkId(),
      Bookmark_Application_ID:this.bkmrkAppSrv.getApplicationId()
    }
    //console.log(data);
    this.bkmrkAppSrv.landlordApprove(data)
    .subscribe(()=>{
      //this.router.navigate(['/landlord/contract/' + this.route.snapshot.params['bkmrkId']])
      this.confirmPaypalId()
    },(err)=>{
      console.log(err);
    })    
  }

  // goToContract(){
  //   this.router.navigate(['/landlord/contract/' + this.route.snapshot.params['bkmrkId']])
  // }

  confirmPaypalId(){
    this.router.navigate(['/landlord/paypal'])
  }
  
  gotoPayments(){
     this.router.navigate(['/landlord/payment/' + this.route.snapshot.params['bkmrkId']])
  }
}
