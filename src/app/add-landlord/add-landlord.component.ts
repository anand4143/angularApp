import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BookmarkService } from '../bookmark/bookmark.service';
import { BookmarkApplicationService,ConfigService,FileService ,EqualValidator,
  PasswordValidator,PhoneValidator,EmailValidator,PhonenumberPipe,AuthService,GobackbuttonService } from '../common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VerificationComponent } from '../dialog/verification/verification.component';
import { DialogService } from "ng2-bootstrap-modal";
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';
@Component({
  selector: 'app-add-landlord',
  templateUrl: './add-landlord.component.html',
  styleUrls: ['./add-landlord.component.css']
})
export class AddLandlordComponent implements OnInit {

  popupBody             : any = {}; 
  approveModel          : any = {};  
  verificationArray     : any = [];
  userVerificationArray : any=[];
  error                 : string = '';
  errorMsg              : string = '';
  verifyStatus          : boolean = false;
  approveFrm            : FormGroup;
  viewLandlordBtn       : boolean = false;
  formFieldsdisable     : boolean = false;
  errorVar              : boolean = false;
  constants = CONSTANTS;

  @ViewChild(SidebarComponent)
  sidebar:SidebarComponent

  constructor(
    private router        : Router, 
    private bkmrk         : BookmarkService,
    private bkmrkAppSrv   : BookmarkApplicationService,
    private route         : ActivatedRoute,
    private config        : ConfigService,
    private frmbuilder    : FormBuilder,
    private fileSrv       : FileService,
    private dialogService : DialogService,
    private auth          : AuthService,
    private gbSrv         : GobackbuttonService
  ) { 
    this.approveFrm = frmbuilder.group({
                              'User_First_Name'         : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
                              'User_Last_Name'          : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
                              'Email_Address'           : [null, Validators.required, this.landlordEmailVerification()],
                              'confirmEmail'            : [null, Validators.required]                                
                          })
                    this.approveFrm.valueChanges.subscribe(data => this.error = '');  
  }

  ngOnInit() {

     this.route.params.subscribe((params: Params) => {
        if(params['bkmrkId']) {
          this.bkmrkAppSrv.setSelectedBookmarkId(params['bkmrkId']);
        }       
      });
        
     
     this.bkmrkAppSrv.getLandlordDetails().subscribe((res)=>{          
          this.approveModel = res.Landlord;
          if(res.Landlord != null) {
            this.formFieldsdisable = true;
            this.approveModel = {
                'User_First_Name' : res.Landlord.User_First_Name,
                'User_Last_Name'  : res.Landlord.User_Last_Name,
                'Email_Address'   : res.Landlord.Email_Address,
                'confirmEmail'    : res.Landlord.Email_Address
            }
          }
          this.bkmrkAppSrv.setLandlordInfo(res.Landlord);              
       });    
     this.getApplication();
  } 

  getApplication(){
    this.bkmrkAppSrv.getApplication()
    .subscribe((appid)=>{
      if( appid.Bookmark_Application_Status < CONSTANTS.bookmarkApplicationStatus.acceptedLandlord ){
        this.viewLandlordBtn = true;
      }        
      if( appid.Broker_User_ID == this.auth.getUserId ){
        this.router.navigate['broker/home'];
      } else {
        this.bkmrkAppSrv.getMasterVerificationItems()
        .subscribe(masterData=>{
          this.verificationArray = masterData;
          this.bkmrkAppSrv.getUserVerificationItems()
          .subscribe(userData=>{
            this.userVerificationArray = userData;        
            this.verificationArray.forEach(this.getUserData, this)
          })
        })
      }
    });
  }

  getUserData(verificationItem, index) {
    verificationItem.Application_Verification_Status = this.constants.verificationStatus.notReviewed;
    verificationItem.Application_Verification_Cost = 0;
    
    switch(verificationItem.Verification_Name){
      case 'UI'   : this.addUserInfo(verificationItem); break;
      case 'ID'   : this.addId(verificationItem); break;
      case 'EV'   : this.evictionCheck(verificationItem); break;
      case 'BACC' : this.bankAccountBalance(verificationItem); break;
      case 'EMP'  : this.employmentCheck(verificationItem); break; 
      case 'CRI'  : this.criminalCheck(verificationItem); break;
      case 'PS'   : this.paystub(verificationItem); break; 
      case 'TF'   : this.taxForms(verificationItem); break;
      case 'CS'   : this.creditScore(verificationItem); break;
      case 'BRKS' : this.brokerageStatement(verificationItem); break;
      case 'BNKS' : this.bankStatement(verificationItem); break; 
      case 'ADC'  : this.addressCheck(verificationItem); break;
    }    
    this.userVerificationArray.forEach(function (item, index) {
      this.updateStatus(verificationItem, item, index)
    }, this);
    this.checkVerificationStatus();
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
      item.File_ID = result.File_ID;
      item.File_Original_Name = result.File_Original_Name;
      item.File_Path = result.File_Path;
      item.userfile =  result.File_Path;
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
    item.text2 = 'SUBMITTED'
    item.fileCounter = 0;  
    this.bkmrkAppSrv.isRenterfileExists('PS1')
      .subscribe(
        ps1info => {
          if(ps1info) {
            item.fileCounter = item.fileCounter + 1;
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
      item.text2 = 'SUBMITTED';
    this.bkmrkAppSrv.isRenterfileExists('BS1')
      .subscribe(
        ps1info => {
          if(ps1info) {
            item.fileCounter = item.fileCounter + 1;
          }
        });      
      this.bkmrkAppSrv.isRenterfileExists('BS2')
      .subscribe(
        ps2info => {
          if(ps2info){           
            item.fileCounter = item.fileCounter + 1;
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
      this.router.navigate(['broker/home'])
    });
  }

  saveVerificationCosts(){
    console.log("this.verificationCosts: ",this.verificationArray);
    
  }

  updateInfo(){
    console.log("this.approveModel: ",this.approveModel);
    var landlord = {
      User_First_Name:this.approveModel.User_First_Name,
      User_Last_Name:this.approveModel.User_Last_Name,
      "Email.Email_Address":this.approveModel.Email_Address
    }
     this.bkmrkAppSrv.sendToLandlord(landlord)
     .subscribe((res) => {
       console.log("res",res);
       this.errorVar = false;
       this.router.navigate(['broker/home']);
     },
     err => {
       console.log("error :",err);
       console.log("error code:",err['code']);
        this.errorVar = true;
        this.errorMsg = MESSAGES[err['code']];
     }
     )
  }

  landlordEmailVerification(){
    console.log("on focus out function");
  }

  gbf() {
    this.gbSrv.gbf();
  }

}
