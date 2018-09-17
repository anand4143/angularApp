import { Component, OnInit } from '@angular/core';
import { RegisterPayInfoService } from '../register-pay-info/register-pay-info.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService,EqualValidator,EmailValidator, GobackbuttonService,BookmarkApplicationService} from '../common'; 
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-edit-paypal',
  templateUrl: './edit-paypal.component.html',
  styleUrls: ['./edit-paypal.component.css']
})
export class EditPaypalComponent implements OnInit {
  paypalInfo='';
  constructor(
    private regPayInfo    : RegisterPayInfoService,
    private router        : Router,    
    private route         : ActivatedRoute,
    private gbSrv         : GobackbuttonService,
    private bkmrkAppSrv   : BookmarkApplicationService
  ) { 
    
  }

  ngOnInit() {
    this.getPaymentInfo();  
      
  }


  getPaymentInfo(){   
    this.regPayInfo.getPaymentInfoData()
    .subscribe((data)=>{
      console.log(data);
      if(data) this.paypalInfo=data.Paypal_ID;   
      else{
        this.editPaypal()
      }  
    },(err)=>{
      console.log(err);
    })
  }

  gbf() {
    this.gbSrv.gbf();
  }

  editPaypal(){
    this.router.navigate(['/landlord/paypal-edit'])
  }

  gotToContract(){
    console.log('Routing to contract')
    this.router.navigate(['/landlord/contract/' + this.bkmrkAppSrv.getSelectedBookmarkId()])
  }
}
