import {  Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {  Router } from '@angular/router';
import {  AuthService,EqualValidator,PasswordValidator,GobackbuttonService } from '../common';
import {  MESSAGES } from '../app.messages';
import {  RegisterUserService } from '../register-user';
import {  RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
import {  DialogComponent, DialogService } from "ng2-bootstrap-modal";
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  pswdMdl       : any =  { };
  pswdFrm       : FormGroup;
  vmsg          : string = '';
  errorMessage  : string = ''; 
  errorMsg      : string = ''; 
  error         = '';
  constructor(
    private router        : Router, 
    private auth          : AuthService, 
    private frmbuilder    : FormBuilder,
    private rgSrv         : RegisterUserService,
    private gbSrv         : GobackbuttonService,
    private dialogService : DialogService,
  ) { 
    this.pswdFrm = frmbuilder.group({
                      'Cur_Password'     : [null, Validators.required],
                      'User_Password'    : [null, Validators.compose([Validators.required, Validators.minLength(8)])],
                      'confirmpassword'  : [null, Validators.required]
                  });
    this.pswdFrm.valueChanges.subscribe(data => this.error = ''); 
  }

  ngOnInit() {
  }

  changePass(){
    //this.errorType    = '';
    this.errorMessage = '';
    let passwordObj : any = {}; 
    passwordObj = {
      "User_ID"       : this.pswdMdl.User_ID,
      "Cur_Password"  : this.pswdMdl.Cur_Password,      
      "User_Password" : this.pswdMdl.User_Password
    }
    console.log("this.pswdMdl==>",this.pswdMdl);    
    this.rgSrv.changePassword(passwordObj)
      .subscribe(
        (user) => {          
         
          let disposable =  this.dialogService.addDialog(RegisterDialogComponent, {
                            title:  this.auth.getName(), 
                            message:  MESSAGES['TXT23']
                            })
                            .subscribe((confirm)=>{
                              console.log("Inside register user");                    
                              this.auth.logout();
                              this.router.navigate(['/']);
                            },
                            (close) => {
                              console.log("you click close");
                            });
        },
         (err) => {
          if(err['code']==='CCU09' || err['code']==='CCU08'){
            this.errorMsg = MESSAGES[err['code']];
          }else{
          this.errorMessage = MESSAGES[err['code']];
          console.log("this.errorMessage:",this.errorMessage);
          }
        }
      )
  }

  gbf() {
    this.gbSrv.gbf();
  }

}
