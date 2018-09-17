import {Component, OnInit,ElementRef, Input, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService,FileService,ConfigService,EqualValidator,PasswordValidator,PhoneValidator,EmailValidator,GobackbuttonService} from '../common';
import { MESSAGES } from '../app.messages';
import {UserSummaryService} from '../user-summary';
import {Observable} from 'rxjs/Rx';
/**confirm model popup */
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { DialogService } from "ng2-bootstrap-modal";
/**End confirm model popup */
@Component({
  selector: 'app-register-brokerage',
  templateUrl: './register-brokerage.component.html',
  styleUrls: ['./register-brokerage.component.css']
})
export class RegisterBrokerageComponent implements OnInit {
  brkMdl : any = { };
  error = '';
  brkFrm : FormGroup;  
  message = '';
  message2 = '';
  inputFile1:File = null;
  inputFile2:File = null;
  BKFile1: any =  { };
  BKFile2: any =  { };
  fileUploads: any = [];
  userFile : any;
 
  constructor(
    private auth          : AuthService,
    private router        : Router, 
    private frmbuilder    : FormBuilder,
    private gbSrv         : GobackbuttonService,
    private usrSrv        : UserSummaryService,
    private fileSrv       : FileService,
    private dialogService : DialogService
  ) { 
    this.brkFrm = frmbuilder.group({
                            'BK1' : [null],
                            'BK2' : [null]                        
                        })
      this.brkFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
     this.BKFile1['File_Original_Name'] = '';
    this.BKFile2['File_Original_Name'] = '';
    if(this.auth.isLoggedIn()){
      this.fileSrv.isfileExists('BK1')
      .subscribe(
        res => { this.BKFile1 = res;}
      );

      this.fileSrv.isfileExists('BK2')
      .subscribe(
        res => { this.BKFile2 = res;}
      );
    }
    console.log(this.inputFile2);
    
  }
  gbf() {
    this.gbSrv.gbf();
  }
  isPresent(seq){
    if(seq == 1) return this.inputFile1 == null && this.BKFile1['File_Original_Name'] != '';
    return this.inputFile2 == null && this.BKFile2['File_Original_Name'] != '';
  }

  isUploadDisabled(){
    return  this.inputFile1 == null &&  this.inputFile2 == null;
  }

  attachFile(event, seq){
    if(seq == 1){
      this.inputFile1 = event.target.files[0];
      this.BKFile1['File_Original_Name'] = this.inputFile1.name; 
    } else {
      this.inputFile2 = event.target.files[0];
      this.BKFile2['File_Original_Name'] = this.inputFile2.name; 
    }
  }

  uploadBrokerageFile(){
     
      if(this.inputFile1 && this.inputFile1.name !=''){
        this.fileUploads.push(this.fileSrv.Upload(this.inputFile1,"BK1"));
      }

      if(this.inputFile2 && this.inputFile2.name !=''){
          this.fileUploads.push(this.fileSrv.Upload(this.inputFile2,"BK2"));
      }
      Observable.onErrorResumeNext(this.fileUploads)
      .subscribe(data => {
        console.log("Data from ForkJoin: ", data)
        this.usrSrv.setStatusToComp('PS');
        if(this.inputFile1 && this.inputFile1.name == data['File_Original_Name']){
          this.inputFile1 = null;
          this.BKFile1 = data;
        }
        if(this.inputFile2 && this.inputFile2.name == data['File_Original_Name']){
          this.inputFile2 = null;
          this.BKFile2 = data;
        }
      },
      err => {
        console.log("Error from ForkJoin: ", err)
      },
      () => {
        console.log("I am DONE..");
        if(this.inputFile1 == null && this.inputFile2 == null){
          //this.router.navigate(['/register-bank']);
        }
      }
      )
   }

  deleteBrokeragefile(typ,msg){
     let disposable = this.dialogService.addDialog(ConfirmComponent, {
        title:'Brokerage File', 
        message:  msg })
        .subscribe((isConfirmed)=>{
          //We get dialog result                    
          if(isConfirmed) {
              this.fileSrv.deleteUserFile(typ)
            .subscribe(
              info =>  {
                if(typ == 'BK1'){
                  this.inputFile1 = null;
                  this.BKFile1 = {}
                  this.BKFile1['File_Original_Name'] = ''; 
                } else {
                  this.inputFile2 = null;
                  this.BKFile2 == {}
                  this.BKFile2['File_Original_Name'] = ''; 
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
     this.usrSrv.setStatusToSkip('BK');
     //this.router.navigate(['/broker/home']);
     this.router.navigate([this.auth.getRoute('home')]);
  }
}
