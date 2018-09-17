import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {  Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService, AuthService } from '../common'
import { HttpService } from '../common';
@Injectable()
export class ForgetService {

  constructor(
    private http    : HttpService,
    private cfgSrv  : ConfigService,
    private cookies : CookieService,
    private auth    : AuthService
  ) { }

  forgetPassword(modelObj : any){
    console.log("Obj in service:",modelObj);

    modelObj.access_token =  this.cfgSrv.getAccessToken();
    console.log("this is from service function",modelObj);
    return this.http.put(this.cfgSrv.getBasePath() + '/users/forgetpassword',modelObj)
    .map((response: Response) => { 
      console.log("get response from server:",response);
      return response;
     
    })
    .catch((error:any) => Observable.throw(error.json()));

  }

}
