import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService, AuthService } from '../common'
import { HttpService } from '../common';
@Injectable()
export class RegisterUserService {
  user: any = {}
  constructor(
              private http    : HttpService,
              private cfgSrv  : ConfigService,
              private cookies : CookieService,
              private auth    : AuthService
            ) { }

  registerUserServiceFunction(rgData: any){  
    
    rgData.access_token = this.cfgSrv.getAccessToken();    
    return this.http.post(this.cfgSrv.getBasePath() + '/users/register',rgData)
     .map((response: Response) => {            
              if (response.json() && response.json().token) {
                  // create a cookies for newuser 
                  this.cookies.put('user',JSON.stringify(response.json()));
              }              
              return response.json();              
      })
      .catch((error:any) => Observable.throw(error.json().message || 'Server error'));
  }

  attachUser(user){
    this.user = user;
  }

  registerUser(registerData){
    console.log("registerData:",registerData);
    registerData.access_token = this.cfgSrv.getAccessToken();    
    return this.http.post(this.cfgSrv.getBasePath() + '/users/newuser',registerData)
     .map((response: Response) => {            
              // if (response.json() && response.json().token) {
              //     // create a cookies for newuser 
              //     this.cookies.put('user',JSON.stringify(response.json()));
              // }
              return response;
          })
          .catch((error) => Observable.throw(error.json())); 
  }

  registerPassword(data){    
    data.access_token = this.cfgSrv.getAccessToken();    
    return this.http.post(this.cfgSrv.getBasePath() + '/users/registerpassword',data)
     .map((response: Response) => {            
              if (response.json() && response.json().token) {
                  // create a cookies for newuser 
                  this.cookies.put('user',JSON.stringify(response.json()));
              }
              return response.json();
          })
          .catch((error) => Observable.throw(error.json())); 
  }

  saveSsnData(ssnObj){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.put(this.cfgSrv.getBasePath() + '/users/'+ this.auth.getUserId()+ '/storessn',ssnObj,options)
    .map((response: Response) => { 
      console.log(response)
      //return true;
    })
    .catch((error:any) => Observable.throw(error)); 
  }

  getUserData(){  
    
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/personalinfo',options)
    .map((response : Response)=>{
      let user = response.json();
      // user.Email = {};
      // user.Contact = {};
      user['Email.Email_Address'] = user.Email_Address;
      user['Contact.Contact_Num'] = user.Contact_Num;
      return user;
      // return response.json()
    })
    .catch((error:any) => Observable.throw(error));
  }

  updateUser(rgData: any){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    // rgData.User_ID = this.auth.getUserId();
    // rgData.access_token = this.cfgSrv.getAccessToken();
    return this.http.put(this.cfgSrv.getBasePath() + '/users/update',rgData,options)
    .map((response: Response) => { 
      console.log(response)
      //this.auth.updateUser(response);
      //return response;
      return true;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  changePassword(rgData: any){
    console.log("rgData form user service annad:",rgData);
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    rgData.User_ID = this.auth.getUserId();
    return this.http.put(this.cfgSrv.getBasePath() + '/users/update/password',rgData,options)
    .map((response: Response) => { 
      //this.auth.logout();           
     // return response.json();
     return true;
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

}
