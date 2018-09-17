import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GobackbuttonService } from '../common';
import { RegisterCreditService } from '../register-credit/register-credit.service';
@Component({
  selector: 'app-credit-report-authorize',
  templateUrl: './credit-report-authorize.component.html',
  styleUrls: ['./credit-report-authorize.component.css']
})
export class CreditReportAuthorizeComponent implements OnInit {
  tcForm:any;
  tcFormModel:any={};
  error:'';
  constructor(
    private frmbuilder      : FormBuilder,
    private regCredService  : RegisterCreditService,
    private router          : Router,
    private auth            : AuthService,
    ) { 
      this.tcForm = frmbuilder.group({
                              'agreeListing'         :    [false, Validators.required],
                              'agreePolicy'          : [false, Validators.required],
                              'agreeContact'     : [false, Validators.required],
                              'agreeAuthorization'     : [false, Validators.required],
                              
                          })
          this.tcForm.valueChanges.subscribe(data => this.error = '');  
    }

  ngOnInit() {
      console.log("In TC",this.regCredService.getAuthStatus())
     if(this.regCredService.getAuthStatus()) this.router.navigate(['/user/register-credit'])
     else{
        this.tcFormModel.agreeListing=false;
        this.tcFormModel.agreePolicy=false;
        this.tcFormModel.agreeContact=false;
        this.tcFormModel.agreeAuthorization=false;
     }     
     
  }

  submit(){
    this.regCredService.acceptAuthstatus(this.tcFormModel)
    .subscribe((data)=>{
      console.log(data);
      this.router.navigate(['credit-report/'+this.auth.getUserId()]);
    },(err)=>{
      console.log(err);
    })
  }

  display(){
    console.log(this.tcFormModel.agreeListing);
  }

}
