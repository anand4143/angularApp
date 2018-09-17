import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService, AuthService } from '../common'
import { HttpService } from '../common';
@Injectable()
export class BackgroundCheckService {

  bgCheckRecord : any;
  bgCheckReport : any;
  bgCheckStatus : boolean;
  constructor(
    private http    : HttpService,
    private cfgSrv  : ConfigService,              
    private auth    : AuthService
  ) { }

  resetAll(){
    this.bgCheckRecord  = null;
    this.bgCheckReport  = null;
    this.bgCheckStatus;
  }

  setBgCheckStatus(status){
    this.bgCheckStatus=status;
  }

  getBgCheckStatus(){
    if(this.bgCheckStatus) return this.bgCheckStatus;
  } 

  setBgCheckRecord(record){
    this.bgCheckRecord=record;
  }

  getBgCheckRecord(){
    if(this.bgCheckRecord) return this.bgCheckRecord;
  }

  setBgCheckReport(report){
    this.bgCheckReport=report;
  }

  getBgCheckReport(){
    if(this.bgCheckReport) return this.bgCheckReport;
  }

  getActiveOrder(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() +'/backgroundcheck/'  + this.auth.getUserId(),options)
    .map((response: Response) => { 
      response=response.json();
      if(!response) this.bgCheckRecord=null;
      else{
        this.setBgCheckRecord(response['record']);
        this.setBgCheckStatus(response['status'])
      }
      return response; 
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  runCheck(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.post(this.cfgSrv.getBasePath() +'/backgroundcheck/'  + this.auth.getUserId()  + '/order',null,options)
    .map((response: Response) => { 
      response=response.json();      
      this.setBgCheckReport(response);   
      return response; 
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  getOrder(userId){
      let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
      let options = new RequestOptions({ headers: headers }); 
      return this.http.get(this.cfgSrv.getBasePath() +'/backgroundcheck/order/' + userId ,options)
      .map((response: Response) => { 
        response=response.json();      
        this.setBgCheckReport(response);
        return response; 
      })
      .catch((error:any) => Observable.throw(error.json())); 
    }
}
