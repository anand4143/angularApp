import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthService,ConfigService } from '../common'
import { HttpService } from '../common';
@Injectable()
export class RegisterEmploymentService {

  constructor(
              private http    : HttpService,
              private cfgSrv  : ConfigService,
              private auth    : AuthService
  ) { }

  getEmployeeList(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });  
      return this.http.get(this.cfgSrv.getBasePath() + '/users/employmentlist',options)
            .map((response:Response) => {
                    return  response.json();
            })
            .catch((error:any) => Observable.throw(error));
  }

  saveEmpData(empData : any){
    console.log("emp data into service function:",empData);
    var comInfo : any = { };
    //comInfo = {"Company_ID": empData.Company_ID};
    //console.log("empData.Company_ID:",empData.Company_ID);
    // if( empData.Company_ID ==  1 ){
        comInfo = {
          "Company_Name":empData.Company_Name,
          "Company_City":empData.Company_City,
          "Company_State":empData.Company_Region,
          "Company_Country":empData.Company_Country
        };        
    // }else  if(empData.Company_Name  ==  '' || empData.Company_Name  == undefined){       
    //     comInfo = {"Company_ID": empData.Company_ID};        
    // }
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    //console.log(comInfo); 
    return this.http.put(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/employment' ,comInfo,options)
    .map((response:Response) => {
      //console.log("response.json()",response.json());
          // response.json(); 
    })
    .catch((error:any) => Observable.throw(error.json()));
  }

  getUserEmpData(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/employment',options)
    .map((response : Response)=>{
      return response.json()
    })
    .catch((error:any) => Observable.throw(error));
  }

  setAccessToken(token){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });   
    return this.http.post(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/settoken/' + token,null,options)
    .map((response : Response)=>{
      return response;
    })
    .catch((error:any) => Observable.throw(error));
  }

  setPlaidTransaction(token){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });   
    return this.http.post(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/settransactions/' + token,null,options)
    .map((response : Response)=>{
      return response;
    })
    .catch((error:any) => Observable.throw(error.json()));
  }

  getPlaidTransaction(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });   
    return this.http.get(this.cfgSrv.getBasePath() + '/users/'+this.auth.getUserId()+'/fetchtransactions/',options)
    .map((response : Response)=>{
      return response.json();
    })
    .catch((error:any) => Observable.throw(error.json()));
  }

}
