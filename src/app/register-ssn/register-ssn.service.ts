import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthService,ConfigService } from '../common'
import { MESSAGES } from '../app.messages';
import { HttpService } from '../common';
@Injectable()
export class RegisterSsnService {

   constructor(
      private http    : HttpService,
      private cfgSrv  : ConfigService,
      private auth    : AuthService) { }

  saveSsnData(ssnData: any){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });  
   return this.http.put(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/ssn' ,ssnData,options)
   .map((response:Response) => {
        // response.json();
    })
    .catch((error:any) => Observable.throw(error));
   
  }

  getUserSsnData(){    
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/ssn',options)
    .map((response : Response)=>{
      return response.json()
    })
    .catch((error:any) => Observable.throw(error));
  }



}
