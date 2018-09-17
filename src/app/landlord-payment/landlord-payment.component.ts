import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RenterPaymentService } from '../renter-payment/renter-payment.service';
import { AuthService ,GobackbuttonService} from '../common';
import { CONSTANTS } from '../app.constants';

@Component({
  selector: 'app-landlord-payment',
  templateUrl: './landlord-payment.component.html',
  styleUrls: ['./landlord-payment.component.css']
})
export class LandlordPaymentComponent implements OnInit {

  contract:any={};
  payments:any=[];
  constants=CONSTANTS;
  selectedPayType:string;

  constructor(
    private auth:AuthService,
    private router        : Router,  
    private route         : ActivatedRoute,     
    private renterPayService : RenterPaymentService,
    private gbSrv : GobackbuttonService
  ) { }

  ngOnInit() {
    this.initializePayments();
  }

  initializePayments(){
    this.renterPayService.getPaymentData(this.route.snapshot.params['bkmrkId'])
    .subscribe((data)=>{
      console.log(data);
      if(data){
        if(data.contract){
          this.contract= data.contract;
        }
        if(data.payments){
          this.payments= data.payments; 
          this.initializePaymentStatus(this.payments);         
        }
      }     
    },(err)=>{
      console.log(err);      
    }) 
  }

  initializePaymentStatus(payments){
    let monthlyArray=[];
    payments.forEach(function(payment,index){      
       if(payment.Payment_Status  == CONSTANTS.paymentInfoStatus.subscriptionEnabled){
         this.selectedPayType = 'subscription';
       } 
       if(payment.Payment_Status  == CONSTANTS.paymentInfoStatus.monthlyEnabled){
         this.selectedPayType = 'monthly';
       }
    },this)  
    console.log(this.selectedPayType); 
  }

  gbf() {
    this.router.navigate(['/landlord/apply/' + this.route.snapshot.params['bkmrkId']])
  }

}
