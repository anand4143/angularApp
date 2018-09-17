import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BookmarkService } from '../bookmark/bookmark.service';
import { BookmarkApplicationService,ConfigService,FileService ,EqualValidator,PasswordValidator,PhoneValidator,EmailValidator,PhonenumberPipe,AuthService,GobackbuttonService } from '../common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VerificationComponent } from '../dialog/verification/verification.component';
import { ReleaseComponent } from '../dialog/release/release.component';
import { CommonDialogComponent } from '../dialog/common-dialog/common-dialog.component';
import { DialogService } from "ng2-bootstrap-modal";
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';
@Component({
  selector: 'app-broker-application',
  templateUrl: './broker-application.component.html',
  styleUrls: ['./broker-application.component.css'],
  providers:[]
})
export class BrokerApplicationComponent implements OnInit {
  popupBody             : any = {}; 
  approveModel          : any = {};  
  verificationArray     : any = [];
  userVerificationArray : any = [];
  // addLandLordButton     : boolean = false;
  verifyStatus          : boolean = false;
  // viewLandlordBtn       : boolean = false;
  // addLandlord           : boolean = false;
  successMsg            : boolean = false;
  // acceptBtn             : boolean = false;
  // documentBtn           : boolean = false;
  // ViewDocumentBtn       : boolean = false;
  approveFrm            : FormGroup; 
  error                 : string = '';
  postBtnMsg            : string = '';
  bkmrkID               : string = '';
  bkmrkAppID             : string = '';
  costsChangeVar        : boolean = false;
  constants = CONSTANTS;
  

  @ViewChild(SidebarComponent)
  sidebar:SidebarComponent

  constructor(
    private router: Router, 
    private bkmrk:  BookmarkService,
    private bkmrkAppSrv:  BookmarkApplicationService,
    private route:  ActivatedRoute,
    private config: ConfigService,
    private frmbuilder:  FormBuilder,
    private fileSrv: FileService,
    private dialogService : DialogService,
    private auth : AuthService,
    private gbSrv : GobackbuttonService
  ) { 
    this.approveFrm = frmbuilder.group({
                              'User_First_Name'         : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
                              'User_Last_Name'          : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
                              'Email_Address'           : [null, Validators.required],
                              'Contact_Num'             : [null, Validators.required] ,
                              'Broker_Payment_Info'     :[null,Validators.required] ,  
                              'Landlord_Payment_Info'   :[null,Validators.required]                                 
                          })
    this.approveFrm.valueChanges.subscribe(data => this.error = '');  
        
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        if(params['bkmrkId']) {
          this.bkmrkAppSrv.setSelectedBookmarkId(params['bkmrkId']);
          this.bkmrkAppSrv.setBookmarkRenterInfo(params['bkmrkId']);
          this.bkmrk.loadBookmark(params['bkmrkId']);
        }
        this.getApplication();
        // this.checkReportStatus();
      });
  }

  getApplication(){
    
    this.bkmrkAppSrv.getApplication()
    .subscribe((appid)=>{
      //console.log("====",this.bkmrkAppSrv.getApplicationStatus());
      this.bkmrkAppID = appid['Bookmark_Application_ID'];
      //  if( appid.Bookmark_Application_Status < CONSTANTS.bookmarkApplicationStatus.docLoaded ){
      //   // this.acceptBtn      = true;
      // }
      // if( appid.Bookmark_Application_Status == CONSTANTS.bookmarkApplicationStatus.docLoaded ){
      //   this.documentBtn      = true;
      // }
      // if( appid.Bookmark_Application_Status > CONSTANTS.bookmarkApplicationStatus.docLoaded ){
      //   this.ViewDocumentBtn      = true;
      // }     
      // if( appid.Bookmark_Application_Status == CONSTANTS.bookmarkApplicationStatus.approvedBroker ){
      //   this.addLandlord      = true;
      // }
      // if( appid.Bookmark_Application_Status > CONSTANTS.bookmarkApplicationStatus.acceptedBroker ){
      //   this.viewLandlordBtn  = true;
      // }     
      if( appid.Broker_User_ID == this.auth.getUserId ){
        this.router.navigate['broker/home'];
      } else {
        this.bkmrkAppSrv.getMasterVerificationItems()
        .subscribe(masterData=>{
          console.log("masterData:",masterData);
          this.verificationArray = masterData;
          this.bkmrkAppSrv.getUserVerificationItems()
          .subscribe(userData=>{ 
             console.log("userData inside getapplication:",userData);
            this.userVerificationArray = userData;        
            this.verificationArray.forEach(this.getUserData, this)
            console.log("this.verificationArray:",this.verificationArray);
          })
        })
      }
    },
    (err) => {
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
    this.checkVerificationStatus();
  }

  updateStatus(verifItem, userVerificationItem, index){    
    if(verifItem.Master_Verification_ID == userVerificationItem.Master_Verification_ID){
      verifItem.Application_Verification_Cost = userVerificationItem.Application_Verification_Cost;
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
      item.userfile =  result.File_Path;
      item.fileId1 = result.File_ID;
      item.fileName1 = result.File_Original_Name
    });
  }

  evictionCheck(item){
    item.text1 = item.Verification_Description;
    item.showTick = true;
  }

  // bankAccountBalance(item){
  //   item.text1 = 'BANK ACCOUNT BALANCE';
  //   item.text2 = '$100,000.00';
  // }
  backgroundCheck(item){
    item.text1 = 'BACKGROUND CHECK';    
  }
  employmentCheck(item){
    this.bkmrkAppSrv.getRenterCompanyInfo()
    .subscribe((emps)=> {
      console.log(emps);
      if(emps.length){
        emps.forEach(function(emp){
           if(emp.Companies_Status == 1){ 
                item.company=emp['company.Company_Name'];        
            }
        })
      }      
    },(err)=>{
      console.log(err)
    })    
    item.text1 = 'EMPLOYMENT';
    //item.text2 = 'INCOME CHECK';
    item.showTick = true;
    item.showIncomeTick = true;
  }
  // criminalCheck(item){
  //   item.text1 = 'CRIMINAL CHECK';
  //   item.showTick = true;
  // }
   W2Check(item){
    item.text1 = 'W2';
    item.showTick = true;
   }

  paystub(item){  
    item.text1 = 'PAY STUBS';
    //item.counterText = ' SUBMITTED'
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
    //item.text2 = ' 450';
  }

  // brokerageStatement(item){
  //     item.text1 = 'BROKERAGE STATEMENT:';
  //     item.text2 = '1 SUBMITTED';
   
  // }

  bankStatement(item){
    item.fileCounter = 0; 
    item.text1 = 'BANK STATEMENT';
    //item.counterText = ' SUBMITTED'
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
  }

  verificationPopup(box,index){
    console.log(index);    
    if(index >=6){
      if( index  == 6 )box.reportType = 'credit-report';
      if( index  == 7 )box.reportType = 'address-report';
      if( index  == 8 )box.reportType = 'background-report';
      sessionStorage.getItem("BookmarkRenterId")
      box.RenterUserId= sessionStorage.getItem("BookmarkRenterId");     
    }
    console.log(box);
    let disposable = this.dialogService.addDialog(VerificationComponent, {
    verificationItem:box})
    .subscribe(()=>{
      this.checkVerificationStatus()
    });
  }

  checkVerificationStatus(){
    this.verifyStatus = true;
    this.verificationArray.forEach(this.checkStatus, this)
    this.verificationArray = this.verificationArray;
  }
  
  checkStatus(verificationItem, index){
    if(verificationItem.Application_Verification_Status != this.constants.verificationStatus.approved){
      this.verifyStatus = false;
    }
  }

  isReviewed(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.notReviewed);
  }

  isApproved(box){
    // console.log("box.Application_Verification_Status--",box);
    // console.log("box.Application_Verification_Status",box.Application_Verification_Status);
    return (box.Application_Verification_Status == this.constants.verificationStatus.approved);
  }

  isInProcess(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.inProcess);
  }

  isIncomplete(box){
    return (box.Application_Verification_Status == this.constants.verificationStatus.inComplete);
  }

  approveApplication(){
  
    this.bkmrkAppSrv.approveApplication(this.approveModel,this.verificationArray)
    .subscribe((response)=>{
      console.log("approve application:",response);
      // this.addLandLordButton = true;
      console.log("hello approveApplication:");
      this.router.navigate(['broker/documents/'+ this.bkmrkAppSrv.getSelectedBookmarkId()]);
    },
    (err) =>{ 
       console.log('verification error',err);
       let disposable = this.dialogService.addDialog(CommonDialogComponent, {
          title: 'Varification?', 
          message:  MESSAGES['TXT25']
        }).subscribe((isConfirmed)=>{
          if(isConfirmed){
            console.log("click ok");
            //this.router.navigate([this.auth.getRoute('usersummary')]);
            }
        
          }); 
       
    });
  }

  saveVerificationCosts(){
    this.bkmrkAppSrv.saveVerificationCosts(this.verificationArray)
    .subscribe((response)=>{
       this.postBtnMsg = MESSAGES['TXT08'];
       this.successMsg = true;       
        setTimeout(function() {
          this.successMsg = false;
          this.costsChangeVar = false;
        }.bind(this), 3000);

    },
    (err)=>{
      this.postBtnMsg = MESSAGES['TXT02'];
    })    
  }

  updateInfo(){
    console.log("this.approveModel: ",this.approveModel);
  }

  addNewLandlord(){
    this.router.navigate(['broker/documents/'+ this.bkmrkAppSrv.getSelectedBookmarkId()]);
  }

  acceptApplication(){
    console.log("",this.bkmrkAppSrv.getSelectedBookmarkId());
  }

  releaseApplication(){
    let disposable = this.dialogService.addDialog(ReleaseComponent, {
          title: MESSAGES['TXT03'], 
          message:  MESSAGES['TXT04']
        }).subscribe(()=>{
          console.log("release button");
        });

  }
  _keyPress(event: any) {
    const pattern = /[0-9\+\-\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }

}

  gbf() {
    this.gbSrv.gbf();
  }

  private checkCostsChanged(event) {        
    this.costsChangeVar = true;
  }
  
  // checkReportStatus(){
  //   this.bkmrkAppSrv.checkCreditReport()
  //   .subscribe((data)=>{
  //     console.log(data);
  //   },(err)=>{
  //     console.log(err)
  //   });
  // }

  acceptAll(){
    this.bkmrkAppSrv.verifyAll()
    .subscribe((res) => {
      console.log("all verify?:",res);
      this.getApplication();    
    },
    (err) => {
      console.log("error:",err);
    });
  }

  addDocument(){
    this.router.navigate(['broker/documents/'+ this.bkmrkAppSrv.getSelectedBookmarkId()]);
  }

  addLandlord(){
    this.router.navigate(['broker/landlord/'+ this.bkmrkAppSrv.getSelectedBookmarkId()]);
  }
}
