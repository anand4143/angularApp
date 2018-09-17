import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../common';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthService,ConfigService } from '../common';

@Injectable()
export class RenterPaymentService {

  constructor(
    private auth    : AuthService,
    private http    : HttpService,
    private cfgSrv  :ConfigService,             
    
  ) { }

  getPaymentData(bkmrkId){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() +'/contract/bookmark/'  + bkmrkId +  '/contractPayments',options)
    .map((response: Response) => { 
      response=response.json();
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  getToken(paymentId,type){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() +'/contract/payment/' + paymentId +'/token/'+ type,options)
    .map((response: Response) => {      
      return response.json();
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  sendNonce(data){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.post(this.cfgSrv.getBasePath() +'/contract/payment/transaction',data,options)
    .map((response: Response) => {   
      response= response.json();   
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  sendPaymentMethodToken(data){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.post(this.cfgSrv.getBasePath() +'/contract/payment/subscribe',data,options)
    .map((response: Response) => {  
      response= response.json();    
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

}
