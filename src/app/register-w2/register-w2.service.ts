import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthService,ConfigService } from '../common'
import { HttpService } from '../common';
@Injectable()
export class RegisterW2Service {

 constructor(
              private http    : HttpService,
              private cfgSrv  : ConfigService,
              private auth    : AuthService
  ) { }

   getEmpployerName(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/employment',options)
    .map((response : Response)=>{
      return response.json()
    })
    .catch((error:any) => Observable.throw(error));
  }

  getW2(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/fetchw2',options)
    .map((response : Response)=>{
      return response.json()
    })
    .catch((error:any) => Observable.throw(error));
  }

}
