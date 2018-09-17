import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router ,ActivatedRoute,Params } from '@angular/router';
import { AuthService,EqualValidator,PasswordValidator, ConfigService} from '../common';
import { RegisterUserService } from '../register-user';
import { MESSAGES } from '../app.messages';
import { CONSTANTS } from '../app.constants';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  passwordModel : any = {};
  error               = '';
  passwordFrm   : FormGroup;
  errorMsg      : String = '';
  errorVar      : boolean = false;

  constructor(
    private frmbuilder  : FormBuilder,
    private router      : Router, 
    private auth        : AuthService,    
    private config      : ConfigService,
    private route       : ActivatedRoute,
    private rgSrv       : RegisterUserService,
    
  ) {
      this.passwordFrm = frmbuilder.group({                           
                            'User_Password'   : [null, Validators.required],
                            'confirmpassword' : [null, Validators.required]                            
                        })
      this.passwordFrm.valueChanges.subscribe(data => this.error = '');
   }

  ngOnInit() {
    this.auth.logout();
  }

  registerPassword(){ 
    console.log("registerPassword function"); 
    this.errorMsg = '';  
    var verificationId=this.route.snapshot.params['verifId'];    
    var data  = {
      Verification_ID:verificationId,
      User_Password:this.passwordModel.User_Password
    }
    console.log("User data for setting the password",data);
    this.rgSrv.registerPassword(data)
    .subscribe((response)=>{
      this.errorVar = false;
      console.log("response for settting new password:",response);
      console.log("user.User_Role from settting new password:",response.user.User_Role);
      if(Number(response.user.User_Role) == Number(CONSTANTS.userRole.renter)) 
        this.router.navigate(['/user/bookmark']);
      else if(Number(response.user.User_Role) == Number(CONSTANTS.userRole.broker)) 
        this.router.navigate(['/broker/home']);
      else this.router.navigate(['/landlord/home']);
    },(err)=>{
      this.errorVar = true;
      console.log("registerPassword function error section",err);
      console.log("registerPassword function error section",err['code']);
      //console.log("registerPassword function error section",err['msg']);
      this.errorMsg = MESSAGES[err['code']];
    })
  }

}
