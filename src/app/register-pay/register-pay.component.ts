import {  Component, OnInit,ElementRef, Input, ViewChild} from '@angular/core';
import {  FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {  Router } from '@angular/router';
import {  AuthService,FileService,ConfigService,EqualValidator,PasswordValidator,PhoneValidator,EmailValidator,GobackbuttonService} from '../common';
import {  MESSAGES } from '../app.messages';
import {  UserSummaryService} from '../user-summary';
import {  RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
import {  Observable} from 'rxjs/Rx';
/**confirm model popup */
import {  ConfirmComponent } from '../dialog/confirm/confirm.component';
import {  DialogService } from "ng2-bootstrap-modal";
/**End confirm model popup */
@Component({
  selector: 'app-register-pay',
  templateUrl: './register-pay.component.html',
  styleUrls: ['./register-pay.component.css']
})
export class RegisterPayComponent implements OnInit {
  payMdl : any = { };
  error = '';
  message = '';
  message2 = '';
  payFrm : FormGroup;
  inputFile1:File = null;
  inputFile2:File = null;
  PSFile1: any =  {};
  PSFile2: any =  {};
  fileUploads: any = [];
  userFile:any;
  sameFilename:boolean = false;
  msg = MESSAGES;

  constructor(
    private auth          : AuthService,
    private router        : Router, 
    private frmbuilder    : FormBuilder,
    private gbSrv         : GobackbuttonService,
    private usrSrv        : UserSummaryService,
    private fupload       : FileService,
    private dialogService : DialogService
  ) { 
    this.payFrm = frmbuilder.group({
                            'PS1' : [null],
                            'PS2' : [null]
                        })
      this.payFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.usrSrv.resetProgress();
    this.PSFile1['File_Original_Name'] = '';
    this.PSFile2['File_Original_Name'] = '';
    if(this.auth.isLoggedIn()){
      this.fupload.isfileExists('PS1')
      .subscribe(
        res1 => {this.PSFile1 = res1;}
      );

      this.fupload.isfileExists('PS2')
      .subscribe(
        res2 => {this.PSFile2 = res2;}
      );
    }
    console.log(this.inputFile2);
  }

  gbf() {
    this.gbSrv.gbf();
  }

  isPresent(seq){
    if(seq == 1){
      return this.inputFile1 == null && this.PSFile1['File_Original_Name'] != '';
  }
    return this.inputFile2 == null && this.PSFile2['File_Original_Name'] != '';
  }

  isUploadDisabled(){

    return  (this.inputFile1 == null &&  this.inputFile2 == null);
   
  }

  attachFile(event, seq){
    if(seq == 1){
      this.inputFile1 = event.target.files[0];
      this.PSFile1['File_Original_Name'] = this.inputFile1.name; 
      console.log("this.inputFile1.name:",this.inputFile1.name);
    } else {
      this.inputFile2 = event.target.files[0];
      this.PSFile2['File_Original_Name'] = this.inputFile2.name;
       console.log("this.inputFile2.name:",this.inputFile2.name); 
    }
    if((this.inputFile1) && (this.inputFile2) && (this.inputFile1.name == this.inputFile2.name) || (this.PSFile1['File_Original_Name'] == this.PSFile2['File_Original_Name'])){
      this.sameFilename = true;
    }else{
       this.sameFilename = false;
    }
    console.log("this.sameFilenameZ:",this.sameFilename);
  }

   uploadPayFile(){
      if(this.inputFile1 && this.inputFile1.name !=''){
        this.fileUploads.push(this.fupload.Upload(this.inputFile1,"PS1"));
      }

      if(this.inputFile2 && this.inputFile2.name !=''){
          this.fileUploads.push(this.fupload.Upload(this.inputFile2,"PS2"));
      }
      Observable.onErrorResumeNext(this.fileUploads)
      .subscribe(data => {
        console.log("Data from ForkJoin: ", data)
        this.usrSrv.setStatusToComp('PS1');
        this.usrSrv.setStatusToComp('PS2');
        if(this.inputFile1 && this.inputFile1.name == data['File_Original_Name']){
          this.inputFile1 = null;
          this.PSFile1 = data;
        }
        if(this.inputFile2 && this.inputFile2.name == data['File_Original_Name']){
          this.inputFile2 = null;
          this.PSFile2 = data;
        }
        
      },
      err => {
        console.log("Error from ForkJoin: ", err)
      },
      () => {
        console.log("I am DONE..");
        // if(this.inputFile1 == null && this.inputFile2 == null){
        //   //this.router.navigate(['/user/register-bank']);
        //    this.router.navigate([this.auth.getRoute('usersummary')]);
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
      }
      )
   }

   deletePayfile(typ,msg){
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
    title:'Pay File', 
    message:  msg })
    .subscribe((isConfirmed)=>{
        //We get dialog result                    
      if(isConfirmed) {
        this.fupload.deleteUserFile(typ)
        .subscribe(
            info =>  {
              if(typ == 'PS1'){
                this.inputFile1 = null;
                this.PSFile1 = {}
                this.PSFile1['File_Original_Name'] = ''; 
              } else {
                this.inputFile2 = null;
                this.PSFile2 == {}
                this.PSFile2['File_Original_Name'] = ''; 
              }
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
  this.usrSrv.setStatusToSkip('PS');
  this.router.navigate(['/user/register-bank']);
}


}
