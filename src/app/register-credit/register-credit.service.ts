import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService, AuthService } from '../common'
import { HttpService } from '../common';
@Injectable()
export class RegisterCreditService {
  questionSet   = [];
  authSession   = '';
  creditScore   = '';
  creditRecord  = {};
  creditReport  = {};
  creditInfoId  = '';
  creditStatus  : boolean;
  authStatus :number=0;
  constructor(
    private http    : HttpService,
    private cfgSrv  : ConfigService,              
    private auth    : AuthService
  ) { }

  setAuthStatus(status){
    console.log("Setting status now",status);
    this.authStatus=status;
  }

  getAuthStatus(){
    return this.authStatus;
  }

  setQuestionSet(questions){
    this.questionSet=questions;
  }

  getQuestionSet(){
    if(this.questionSet.length != 0) return this.questionSet
  }

  setauthSession(auth){
    this.authSession=auth;
  }

  getauthSession(){
    if(this.authSession.length != 0) return this.authSession;
  }

  resetAll(){
    this.questionSet=[];
    this.authSession='';
    this.creditScore='';
    this.creditReport={};
    this.creditRecord={};
    this.creditStatus;
    this.creditInfoId= '';
  }

  setCreditScore(score){
    this.creditScore=score
  }

  getCreditScore(){
    //console.log("this.creditScore==>:",this.creditScore);
    if(this.creditScore) return this.creditScore;
  }

  setCreditInfoId(id){
    this.creditInfoId=id
  }

  getCreditInfoId(){    
    if(this.creditInfoId) return this.creditInfoId;
  }

  setCreditStatus(status){
    this.creditStatus=status
  }

  getCreditStatus(){
    if(this.creditStatus)return this.creditStatus;
  }

  setCreditRecord(record){
    this.creditRecord=record
  }

  getCreditRecord(){
    if(this.creditRecord)return this.creditRecord;
  }

  setCreditReport(report){
    this.creditReport=report;
  }

  getCreditReport(){
    if(this.creditReport)return this.creditReport;
  }

  saveCreditData(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.post(this.cfgSrv.getBasePath() +'/creditcheck/'  + this.auth.getUserId()+  '/new',null,options)
    .map((response: Response) => { 
      response=response.json();
      this.setauthSession(response['authSession']);
      this.setQuestionSet(response['preciseIDServer']['KBA']['QuestionSet']);
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  sendAnswers(answers){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    var auth=this.getauthSession();
    var data={
      Answers:answers,
      Authsession:auth
    }
    console.log("Auth Status before",this.getAuthStatus())
    return this.http.post(this.cfgSrv.getBasePath() +'/creditcheck/'  + this.auth.getUserId()+'/sendanswers',data,options)
    .map((response: Response) => { 
      response=response.json();
      console.log("Id before",response['User_Credit_Info_ID']);
      this.setCreditInfoId(response['User_Credit_Info_ID']);      
      console.log("Auth Status after",this.getAuthStatus());
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  //  getReport(){
   getReport(renterId){
    console.log("In report generation");
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });     var auth=this.getauthSession();    
    // return this.http.get(this.cfgSrv.getBasePath() +'/creditcheck/'  + this.auth.getUserId()+'/report',options)
    return this.http.get(this.cfgSrv.getBasePath() +'/creditcheck/'  + renterId +'/report',options)
    .map((response: Response) => { 
      response =  response.json();       
      console.log("Score in response",response['CreditProfile']['RiskModel'][0].Score);
      this.setCreditReport(response['CreditProfile']);
      this.setCreditScore(response['CreditProfile']['RiskModel'][0].Score);        
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  getStatus(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });     var auth=this.getauthSession();    
    return this.http.get(this.cfgSrv.getBasePath() +'/creditcheck/'  + this.auth.getUserId()+'/check',options)
    .map((response: Response) => { 
      response =  response.json();
      console.log()
      if(response){
        this.setCreditRecord(response['credit']);
        this.setCreditInfoId(response['credit']['User_Credit_Info_ID'])        
        this.setCreditStatus(response['status']);
      }
      else{
        this.creditStatus=false;
        this.creditRecord=null;
      }
      if(response['status']){
        this.setAuthStatus(response['credit']['User_Auth_Status'])
      }
      return response
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  acceptAuthstatus(data){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    var auth=this.getauthSession();  
    console.log("Before Hitting",this.getCreditInfoId())  
    return this.http.post(this.cfgSrv.getBasePath() +'/creditcheck/'  + this.getCreditInfoId() +'/user/'+ this.auth.getUserId()+'/authstatus',data,options)
    .map((response: Response) => { 
      response =  response.json();
      this.setAuthStatus(response);
      return response;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

}
