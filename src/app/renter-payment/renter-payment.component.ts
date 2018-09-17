import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RenterPaymentService } from './renter-payment.service';
import { AuthService , OrderByPipe, GobackbuttonService} from '../common';
import { CONSTANTS } from '../app.constants';

declare var paypal: any;

var braintree = require('braintree-web');
var client = require('braintree-web/client');
var paypalCheckout = require('braintree-web/paypal-checkout');
var hostedFields = require('braintree-web/hosted-fields');

@Component({
  selector: 'app-renter-payment',
  templateUrl: './renter-payment.component.html',
  styleUrls: ['./renter-payment.component.css'],
  providers:[OrderByPipe]
})
export class RenterPaymentComponent implements OnInit {

  contract:any={};
  payments:any=[];  
  constants=CONSTANTS;
  selectedPayType:string;
  error:'';
  constructor(
    private auth:AuthService,
    private router        : Router,  
    private route         : ActivatedRoute,   
    private frmbuilder    : FormBuilder,   
    private renterPayService : RenterPaymentService,
    private gbSrv : GobackbuttonService
  ) { }

  ngOnInit() {    
    this.initializePayments();
  }

  sendNonce(data,index){
    console.log("Inside sendNonce");
    this.renterPayService.sendNonce(data)
    .subscribe((res)=>{
      console.log("Sent to server",res);
      this.payments[index]=res;
    },(err)=>{
      console.log(err);
      this.payments[index]['error']= err.msg;
    })
  }
  
  generateButtonsarray(payments){
    let monthlyArray=[];
    payments.forEach(function(payment,index){     
       if(payment.Payment_Status  == CONSTANTS.paymentInfoStatus.active){
         if(payment.Payment_Type == CONSTANTS.paymentType.monthly){
           monthlyArray.push(this.generateButton(payment,index))
         }
         else if(payment.Payment_Type == CONSTANTS.paymentType.subscription){
           this.generateSubsription(payment)
         }
       }  
       if(payment.Payment_Status  == CONSTANTS.paymentInfoStatus.subscriptionEnabled){
         this.selectedPayType = 'subscription';
       } 
       if(payment.Payment_Status  == CONSTANTS.paymentInfoStatus.monthlyEnabled){
         this.selectedPayType = 'monthly';
       }
    },this)  
    console.log(this.selectedPayType); 
  }

  generateButton(payment,index){
     this.renterPayService.getToken(payment.Payment_ID,"monthly")
     .subscribe((clienToken)=>{
        console.log(clienToken); 
        // Be sure to have PayPal's checkout.js library loaded on your page.
        // <script src="https://www.paypalobjects.com/api/checkout.js" data-version-4></script>
        let renterPaymentComponent = this;

        // Create a client.
        braintree.client.create({
          authorization: clienToken.token
        }, function (clientErr, clientInstance) {

          // Stop if there was a problem creating the client.
          // This could happen if there is a network error or if the authorization
          // is invalid.
          if (clientErr) {
            console.error('Error creating client:', clientErr);
            return;
          }

          // Create a PayPal Checkout component.
          braintree.paypalCheckout.create({
            client: clientInstance
          }, function (paypalCheckoutErr, paypalCheckoutInstance) {

            // Stop if there was a problem creating PayPal Checkout.
            // This could happen if there was a network error or if it's incorrectly
            // configured.
            if (paypalCheckoutErr) {
              console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
              return;
            }

            // Set up PayPal with the checkout.js library
            var btnName = '#paypal-button'.concat(index)
            paypal.Button.render({
              env: 'sandbox', // or 'sandbox'
              style: {
                  size: 'small',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay'
              },
              payment: function () {
                return paypalCheckoutInstance.createPayment({
                  flow: 'checkout', // Required
                  amount: (payment.Payment_Amount*10)/payment.Payment_Amount, // Required
                  currency: 'USD', // Required
                  locale: 'en_US',                 
                  enableShippingAddress: false,
                  shippingAddressEditable: false                
                });
              },

              onAuthorize: function (data,actions) {
                console.log("Inside onAuthorize");
                return paypalCheckoutInstance.tokenizePayment(data)
                  .then(function (payload) {
                    // Submit `payload.nonce` to your server
                    console.log("Received nonce",payload.nonce);
                    var nonceData={
                      Payment_Method_Nonce:payload.nonce,
                      Payment_ID:payment.Payment_ID,
                      Pay_Amount:(payment.Payment_Amount*10)/payment.Payment_Amount,
                      Payment_Amount:payment.Payment_Amount,
                      Renter_User_ID:renterPaymentComponent.auth.getUserId(),
                      Contract_ID:payment.Contract_ID                      
                    }
                    renterPaymentComponent.sendNonce(nonceData,index)
                  });
              },

              onCancel: function (data) {
                console.log('checkout.js payment cancelled');
              },

              onError: function (err) {
                console.error('checkout.js error', err);
              }
            }, btnName).then(function () {
              // The PayPal button will be rendered in an html element with the id
              // `paypal-button`. This function will be called when the PayPal button
              // is set up and ready to be used.
            });

          });

        });      
    },(err)=>{
      console.log(err);
    })
  }

  sendPaymentMethodtoken(data){    
    this.renterPayService.sendPaymentMethodToken(data)
    .subscribe((res)=>{
      console.log("Sent to server",res);
      this.initializePayments();      
    },(err)=>{
      console.log(err);
      this.error= err.msg;
    })
  }

  generateSubsription(payment){

     this.renterPayService.getToken(payment.Payment_ID,"subscription")
     .subscribe((clienToken)=>{
        console.log(clienToken); 
        let renterPaymentComponent = this;
              // Be sure to have PayPal's checkout.js library loaded on your page.
        // <script src="https://www.paypalobjects.com/api/checkout.js" data-version-4></script>

        // Create a client.
        braintree.client.create({
          authorization: clienToken.token
        }, function (clientErr, clientInstance) {

          // Stop if there was a problem creating the client.
          // This could happen if there is a network error or if the authorization
          // is invalid.
          if (clientErr) {
            console.error('Error creating client:', clientErr);
            return;
          }

          // Create a PayPal Checkout component.
          braintree.paypalCheckout.create({
            client: clientInstance
          }, function (paypalCheckoutErr, paypalCheckoutInstance) {

            // Stop if there was a problem creating PayPal Checkout.
            // This could happen if there was a network error or if it's incorrectly
            // configured.
            if (paypalCheckoutErr) {
              console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
              return;
            }

            // Set up PayPal with the checkout.js library
            paypal.Button.render({
              env: 'sandbox', // or 'sandbox'

              payment: function () {
                return paypalCheckoutInstance.createPayment({
                  flow: 'vault',
                  billingAgreementDescription: 'Your agreement description',
                  enableShippingAddress: false,
                  shippingAddressEditable: false                  
                });
              },

              onAuthorize: function (data, actions) {
                return paypalCheckoutInstance.tokenizePayment(data)
                  .then(function (payload) {
                    // Submit `payload.nonce` to your server.
                    console.log("Nonce",payload.nonce);
                    var billingDay=(new Date(payment.Payment_Due_Date)).getDate();
                    var data={
                      nonce:payload.nonce,
                      type:payload.type,
                      rent:payment.Payment_Amount,
                      prorateDays:payment.Payment_Prorate_Days,
                      Payment_ID:payment.Payment_ID,
                      Payment_Billing_Cycles:payment.Payment_Billing_Cycles,
                      Billing_Date:billingDay,
                      Renter_User_ID:renterPaymentComponent.auth.getUserId(),
                      Contract_ID:payment.Contract_ID                      
                    }
                    renterPaymentComponent.sendPaymentMethodtoken(data)
                  });
              },

              onCancel: function (data) {
                console.log('checkout.js payment cancelled');
              },

              onError: function (err) {
                console.error('checkout.js error', err);
              }
            }, '#paypal-button').then(function () {
              // The PayPal button will be rendered in an html element with the id
              // `paypal-button`. This function will be called when the PayPal button
              // is set up and ready to be used.
            });

          });

        }); 
          
    },(err)=>{
      console.log(err);
    })
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
          this.generateButtonsarray(this.payments);
        }
      }     
    },(err)=>{
      console.log(err);      
    }) 
  }

  gbf() {
    this.gbSrv.gbf();
  }

}
