import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../common';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService, AuthService } from '../common'

@Injectable()
export class RegisterPayInfoService {

  paypalId:any=null;

  resetAll(){
    this.paypalId=null;
  }

  getPaypalId(){
   return this.paypalId;
  }
  
  setPaypalId(id){
    console.log('Setting Id');
    this.paypalId=id;
    console.log(this.paypalId);
  }

  constructor(
    private http    :HttpService,
    private cfgSrv  :ConfigService,              
    private auth    : AuthService
  ) {  }

  savePaymentInfoData(data){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.post(this.cfgSrv.getBasePath() +'/contract/landlord/'  + this.auth.getUserId()+  '/newpaypalId',data,options)
    .map((response: Response) => { 
      response=response.json();
      this.setPaypalId(response['Paypal_ID']);
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  getPaymentInfoData(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() +'/contract/landlord/'  + this.auth.getUserId()+  '/getpaypalId',options)
    .map((response: Response) => { 
      response=response.json();
      if(response){
        this.setPaypalId(response['Paypal_ID']);
      }
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

}
