import {  Component, OnInit,ElementRef, Input, ViewChild} from '@angular/core';
import {  FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {  Router } from '@angular/router';
import {  AuthService,FileService,ConfigService,EqualValidator,PasswordValidator,PhoneValidator,
  EmailValidator,GobackbuttonService,OrderbyDatePipe,OrderByPipe} from '../common';
import {  MESSAGES } from '../app.messages';
import {  UserSummaryService} from '../user-summary';
import {  RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
import {  Observable} from 'rxjs/Rx';
/**confirm model popup */
import {  ConfirmComponent } from '../dialog/confirm/confirm.component';
import { SuccessComponent } from '../dialog/success/success.component';
import {  DialogService } from "ng2-bootstrap-modal";
import { RegisterEmploymentService } from '../register-employment/register-employment.service'
/**End confirm model popup */
declare var Plaid:any;
@Component({
  selector: 'app-register-bank',
  templateUrl: './register-bank.component.html',
  styleUrls: ['./register-bank.component.css'],
  providers:[OrderbyDatePipe]
})
export class RegisterBankComponent implements OnInit {
  bankMdl     : any = { };
  userFile    : any;
  plaidMessage: string ='';
  bankFrm     : FormGroup;  
  fileUploads : any   = [];
  inputFile1  : File  = null;
  inputFile2  : File  = null;
  BSFile1     : any   =  { };
  BSFile2     : any   =  { };
  message             = '';
  message2            = '';
  error               = '';
  sameFilename:boolean = false;
  transactions=[];
  isPlaid : number = 0
  options=[{value:1,text:'Login Using Plaid'},{value:2,text:'Upload Manually'}];
  msg = MESSAGES;
  constructor(
                private auth          : AuthService,
                private router        : Router, 
                private frmbuilder    : FormBuilder,
                private gbSrv         : GobackbuttonService,
                private usrSrv        : UserSummaryService,
                private fileSrv       : FileService,
                private empSrv: RegisterEmploymentService,
                private dialogService : DialogService
            ) { 
                this.bankFrm = frmbuilder.group({
                                        'BS1' : [null],
                                        'BS2' : [null],
                                        'BankStmtOption':[0]                        
                                    })
                  this.bankFrm.valueChanges.subscribe(data => this.error = '');
              }

  ngOnInit() {
    this.usrSrv.resetProgress();
    this.bankMdl.BankStmtOption=0;    
    this.initializePlaidTransactions();    
  }

  gbf() {
    this.gbSrv.gbf();
  }

  isPresent(seq){
    if(seq == 1) return this.inputFile1 == null && this.BSFile1['File_Original_Name'] != '';
    return this.inputFile2 == null && this.BSFile2['File_Original_Name'] != '';
  }

  isUploadDisabled(){
    return  this.inputFile1 == null &&  this.inputFile2 == null;
  }

  attachFile(event, seq){
    if(seq == 1){
      this.inputFile1 = event.target.files[0];
      this.BSFile1['File_Original_Name'] = this.inputFile1.name; 
    } else {
      this.inputFile2 = event.target.files[0];
      this.BSFile2['File_Original_Name'] = this.inputFile2.name; 
    }
      // this.BSFile2['File_Original_Name'] = this.inputFile2.name; 
    if((this.inputFile1) && (this.inputFile2) && (this.inputFile1.name == this.inputFile2.name) || (this.BSFile1['File_Original_Name'] == this.BSFile2['File_Original_Name'])){
      this.sameFilename = true;
    }else{
       this.sameFilename = false;
    }
    console.log("this.sameFilenameZ:",this.sameFilename);
  }

   uploadBankFile(){
      if(this.inputFile1 && this.inputFile1.name !=''){
        this.fileUploads.push(this.fileSrv.Upload(this.inputFile1,"BS1"));
      }

      if(this.inputFile2 && this.inputFile2.name !=''){
          this.fileUploads.push(this.fileSrv.Upload(this.inputFile2,"BS2"));
      }
      Observable.onErrorResumeNext(this.fileUploads)
      .subscribe(data => {
        console.log("Data from ForkJoin: ", data)
        this.usrSrv.setStatusToComp('BS1');
        this.usrSrv.setStatusToComp('BS2');
        if(this.inputFile1 && this.inputFile1.name == data['File_Original_Name']){
          this.inputFile1 = null;
          this.BSFile1 = data;
        }
        if(this.inputFile2 && this.inputFile2.name == data['File_Original_Name']){
          this.inputFile2 = null;
          this.BSFile2 = data;
        }
        
      },
      err => {
        console.log("Error in Upload: ", err)
      },
      () => {
        console.log("I am DONE..");
        // if(this.inputFile1 == null && this.inputFile2 == null){
        //   //this.router.navigate(['/user/home']);
        //  // this.router.navigate(['/user/register-credit']);
        //   this.router.navigate([this.auth.getRoute('usersummary')]);
        // }
        let disposable =  this.dialogService.addDialog(RegisterDialogComponent, {
                            title:  this.auth.getName(), 
                            message:  MESSAGES['TXT22']
                            })
                            .subscribe((confirm)=>{
                              console.log("Inside register user");                    
                              this.router.navigate([this.auth.getRoute('usersummary')]);
                            },
                            (close) => {
                              console.log("you click close");
                            });

      })
   }

   deleteBankfile(typ,msg){
     console.log("type:",typ);
     console.log("msg:",msg);
      let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title:'Bank Files', 
      message:  msg })
      .subscribe((isConfirmed)=>{
        //We get dialog result                    
        if(isConfirmed) {
          this.fileSrv.deleteUserFile(typ)
          .subscribe(
            info =>  {
              if(typ == 'BS1'){
                this.inputFile1 = null;
                this.BSFile1 = {}
                this.BSFile1['File_Original_Name'] = ''; 
              } else {
                this.inputFile2 = null;
                this.BSFile2 == {}
                this.BSFile2['File_Original_Name'] = ''; 
              }
              this.bankMdl.BankStmtOption=0;
              this.initializePlaidTransactions();
            },
            (err) => {
              console.log(err);
            }
          )
        }else {
            console.log("you click cancel button");
        }
    });
  }

   skippedFun(){
     this.usrSrv.setStatusToSkip('BS');
     //this.router.navigate(['/user/home']);
     this.router.navigate(['/user/register-credit']);
  }

  initializePlaid(){
    let regIncomeComp= this
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
        // Send the public_token to your app server here.
        // The metadata object contains info about the institution the
        // user selected and the account ID, if selectAccount is enabled.
        console.log('Success');
        console.log('public_token',public_token);
        console.log('metadata',metadata);
        regIncomeComp.empSrv.setPlaidTransaction(public_token)
        .subscribe(()=>{          
          var msg= "Pulling your transactions from plaid. Check after some time"
          regIncomeComp.openDialog(msg);
          regIncomeComp.router.navigate(['/user/usersummary']);
          regIncomeComp.bankMdl.BankStmtOption=0;
        },(err)=>{
          console.log(err);
          regIncomeComp.bankMdl.BankStmtOption=0;
          if(err.code == 'CCU18')regIncomeComp.openDialog(MESSAGES['TXT36'])
        })
      },
      onExit: function(err, metadata) {
        regIncomeComp.bankMdl.BankStmtOption=0;
        console.log('Coming out..')
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

  openDialog(msg) {
    let disposable = this.dialogService.addDialog(SuccessComponent, {
      message: msg
    })
    .subscribe((res) => {
      if (res) {
        console.log('Closed')
      }
    });
  }

  initializePlaidTransactions(){    
     this.empSrv.getPlaidTransaction()
      .subscribe((data)=>{
        console.log("Plaid data",data); 
        if(data){
          if(data.transactions.length){
            this.isPlaid=1;
            this.transactions=data.transactions;
          }else{
            if(data.status == 1 || data.status == 2) {
              this.plaidMessage= 'Fetching from plaid';
              console.log(this.plaidMessage);
            }
            else this.plaidMessage= 'No transactions avialable '
          }
        }          
        else{          
          this.initializeUserFiles();
        }   
      },
      (err) => {
        console.log("Error",err);
      });
  }


  initializeUserFiles(){  
      //this.isPlaid=2;
      this.BSFile1['File_Original_Name'] = '';
      this.BSFile2['File_Original_Name'] = '';
      if(this.auth.isLoggedIn()){
        this.fileSrv.isfileExists('BS1')
        .subscribe(
          res => {   
            this.isPlaid=2;          
            this.BSFile1 = res;            
          },
          (err)=>{
            console.log(err);
          }
        );
        this.fileSrv.isfileExists('BS2')
        .subscribe(
          res => { 
            this.isPlaid=2;             
            this.BSFile2 = res;            
          },
          (err)=>{
            console.log(err);
          }
        );
      }
      console.log(this.inputFile2);  
  }

  optionChange(){
    if(this.bankMdl.BankStmtOption == 1){
      this.isPlaid=1;
      this.initializePlaid();
    }
    else if(this.bankMdl.BankStmtOption == 2){
      this.isPlaid=2;
      this.initializeUserFiles();
    }
  }

  isNotEmpty(transactions){
    //console.log('Checking array length');
    if(transactions.length){
      return true;
    }
    else{
      return false;
    }
  }
}
