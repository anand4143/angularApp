import {  Component, OnInit,ElementRef, Input, ViewChild} from '@angular/core';
import {  FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {  Router } from '@angular/router';
import {  AuthService,FileService,ConfigService,EqualValidator,PasswordValidator,PhoneValidator,EmailValidator,GobackbuttonService} from '../common';
import {  MESSAGES } from '../app.messages';
import {  RegisterW2Service } from './register-w2.service';
import {  UserSummaryService} from '../user-summary';
import {  RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
/**confirm model popup */
import {  ConfirmComponent } from '../dialog/confirm/confirm.component';
import {  DialogService } from "ng2-bootstrap-modal";
/**End confirm model popup */

@Component({
  selector: 'app-register-w2',
  templateUrl: './register-w2.component.html',
  styleUrls: ['./register-w2.component.css']
})

export class RegisterW2Component implements OnInit {
  plaidW2={};
  manualUpload:number=0;
  employerName  : any = { };
  W2File        : any =  { };
  w2Mdl         : any = { };
  userFile      : any;
  error         = '';
  w2Frm         : FormGroup;
  inputFile     : File;
  isUploaded    : boolean = false;
  isSelected    : boolean = false;
  //isPulled      : boolean = false; 

  constructor(             
                  private router          : Router, 
                  private auth            : AuthService,
                  private frmbuilder      : FormBuilder,
                  private gbSrv           : GobackbuttonService,
                  private usrSrv          : UserSummaryService,
                  private fileSrv         : FileService,
                  private empw2Srv        : RegisterW2Service,
                   private dialogService  : DialogService
            ) {
                  this.w2Frm = frmbuilder.group({
                                'w2files'         : [null]                            

                  })
                  this.w2Frm.valueChanges.subscribe(data => this.error = '');
            }

  ngOnInit() {  
    this.manualUpload=0;
    this.usrSrv.resetProgress(); 
    
    this.empw2Srv.getW2() 
    .subscribe((res) => {
        console.log("W2",res);   
        if(res){
          this.manualUpload=1;
          this.plaidW2=res; 
        } 
        else{
          this.manualUpload=2;
        }
      },
      (err) => {
        console.log("error:",err);
      }
    )    
    this.fileSrv.isfileExists('W2')
    .subscribe(
      res => {
        console.log("STUB 1 ",res);
        this.W2File = res;
        if(this.W2File){
            this.isUploaded = true;
            //this.isPulled = true;
        }
      },
      err => {
          console.log(err);
      }
    )
    if(this.auth.isLoggedIn()){
     this.fileSrv.getUserFiles('W2')
      .subscribe((user)=>{
         this.W2File.File_Original_Name = user['File_Original_Name'];
      })
    }
    this.empw2Srv.getEmpployerName()
    .subscribe((user)=> {
      console.log(user);
      this.employerName = user;
    },
    (err) => {
      console.log(err);
    }
    );
    
  }

  goToW2Result(){
    //console.log("create register w2result Component");
    //this.usrSrv.setStatusToComp('W2');
    // this.router.navigate(['register-w2result']);
     // this.isPulled = true;
      this.fileSrv.isfileExists('W2')
    .subscribe(
      (res) => {
        console.log("STUB 1 ",res);
        this.W2File = res;
        if(this.W2File){
            this.isUploaded = true;
            //this.isPulled = true;
        }
      },
      (err) => {
          console.log("error:",err);
      }
    )
     
   
  }

  gbf() {
    this.gbSrv.gbf();
  }

  attachFile(event){
    console.log("File Selected");
    this.inputFile = event.target.files[0];
    console.log(this.inputFile);
    this.isSelected = true;
    this.W2File['File_Original_Name'] = this.inputFile.name; 
  }

  uploadUserFile(){  
    console.log("component==> ",this.inputFile); 
    this.fileSrv.Upload(this.inputFile,"W2")
     .subscribe( 
       (user)  => {         
         //this.usrSrv.setStatusToComp('W2');
        // this.router.navigate(['/user/register-credit']);
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
      },
    (err) => {
      console.log("error ==> ",err);
    }
    );
  }

  deleteW2file(msg){
    
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
        title:'W2 File?', 
        message:  msg })
        .subscribe((isConfirmed)=>{
            //We get dialog result                    
        if(isConfirmed) {
            this.fileSrv.deleteUserFile('W2')
            .subscribe(
                info =>  {
                  console.log("successfully deleted W2 file for this user");
                  this.isUploaded = false;
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
     this.usrSrv.setStatusToSkip('W2');
     //this.router.navigate(['/user/register-credit']);
     this.router.navigate(['/user/register-identification']);
  }

}
