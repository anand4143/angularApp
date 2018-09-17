import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService,EqualValidator,EmailValidator, GobackbuttonService,BookmarkApplicationService} from '../common'; 
import { RegisterPayInfoService } from './register-pay-info.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-register-pay-info',
  templateUrl: './register-pay-info.component.html',
  styleUrls: ['./register-pay-info.component.css']
})
export class RegisterPayInfoComponent implements OnInit {

  paymentInfoModel   : any =  { };  
  errorMessage  : string = ''; 
  paymentFrm     : FormGroup;  
  error         = '';
  constructor(
    private router        : Router,     
    private bkmrkAppSrv   : BookmarkApplicationService,
    private route         : ActivatedRoute,   
    private frmbuilder    : FormBuilder,   
    private auth          : AuthService,
    private gbSrv         : GobackbuttonService,
    private regPayInfo    : RegisterPayInfoService
  ) { 
    this.paymentFrm = frmbuilder.group({             
              'Email_Address'                    : [null, Validators.required],
              'Confirm_Email_Address'            : [null, Validators.required]                                
          })
    this.paymentFrm.valueChanges.subscribe(data => this.error = '');
  }

   ngOnInit() {
     
   }

   gbf() {
    this.gbSrv.gbf();
   }

   savePaymentInfo(){
     var data={
       Email_Address:this.paymentInfoModel.Email_Address
     }
     this.regPayInfo.savePaymentInfoData(data)
     .subscribe((data)=>{
       console.log(data);
       //this.router.navigate(['/landlord/contract/' + this.bkmrkAppSrv.getSelectedBookmarkId()])
       this.gbf();
     },(err)=>{
       console.log(err);
     })
   }

    


}
