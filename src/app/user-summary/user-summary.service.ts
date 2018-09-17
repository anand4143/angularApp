import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConfigService,AuthService } from '../common'
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { CookieService } from 'angular2-cookie/core';
import { CONSTANTS } from '../app.constants';
import { HttpService } from '../common';
@Injectable()
export class UserSummaryService {
    isCreportActive:boolean;
    activeCreditInfoId='';
    showPopup: boolean = false;
  //private error : any ;
    progress:any = {
        "PER":{"comp": false, "skip": false},
        "SSN":{"comp": false, "skip": false},
        "EMP":{"comp": false, "skip": false},
        "W2":{"comp": false, "skip": false},
        "CC":{"comp": false, "skip": false},
        "ID":{"comp": false, "skip": false},
        "PS1":{"comp": false, "skip": false},
        "PS2":{"comp": false, "skip": false},
        "BS1":{"comp": false, "skip": false},
        "BS2":{"comp": false, "skip": false},
        "BK":{"comp": false, "skip": false},
        "AC":{"comp": false, "skip": false},
        "BC":{"comp": false, "skip": false}
    };
    

  constructor(
    private http          : HttpService,
    private configService : ConfigService,
    private cookies       : CookieService,
    private auth          : AuthService,
  ) { 
    this.cookies.put('progress',JSON.stringify(this.progress));
  }

  setIsCreportactive(){
    //console.log("setting status");
    this.isCreportActive=true
  }

  getIsCreportactive(){
    return this.isCreportActive;
  }

  setCreditInfoId(id){
    //console.log("setting Id");
    this.activeCreditInfoId=id
  }

  getCreditInfoId(){
    if(this.activeCreditInfoId)return this.activeCreditInfoId;
  }

  resetAll(){
    this.isCreportActive=false;
    this.activeCreditInfoId='';
  }

  getPersonalInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/users/'+this.auth.getUserId() +'/personalinfo';      
      return this.http.get(url, options)
          .map((response: Response) => {
              if(response.json()) this.setStatusToComp("PER");
              return response.json();
            });
  }

  getSSNInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/users/'+this.auth.getUserId() +'/ssn';      
      return this.http.get(url, options)
          .map((response: Response) => {
              if(response.json()) this.setStatusToComp("SSN");
              return response.json();
            });
  }

  getCompanyInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/users/'+this.auth.getUserId() +'/employment';      
      return this.http.get(url, options)
          .map((response: Response) => {
            //console.log("getCompanyInfo: ", response.json());
              if(response.json()){
                this.setStatusToComp("EMP");
                return response.json();
              }
            }).catch(error => Observable.throw(error));
  }
  getCreditInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/creditcheck/'  + this.auth.getUserId()+'/check';      
      return this.http.get(url, options)
          .map((response: Response) => {
            //console.log("getCreditInfoInfo: ", response.json());            
              if(response.json() != null){
                if(response.json()['status']){
                  this.setStatusToComp('CC');
                }                
                if(response.json()['status'] && response.json()['credit']['User_Auth_Status']){
                  this.setIsCreportactive();
                  this.setCreditInfoId(response.json()['credit']['User_Credit_Info_ID']);
                }                
                return response.json();
              }
            }).catch(error => Observable.throw(error.json()));
  } 

  getAddressInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/addresscheck/'  + this.auth.getUserId()+'/get/all';      
      return this.http.get(url, options)
          .map((response: Response) => {
            //console.log("getAddressInfo: ", response.json());            
              if(response.json() != null){
                if(response.json()['status']){
                  this.setStatusToComp('AC');
                }                
                return response.json();
              }
            }).catch(error => Observable.throw(error.json()));
  }

  getBackgroundInfo(){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/backgroundcheck/'  + this.auth.getUserId();      
    return this.http.get(url, options)
        .map((response: Response) => {
          //console.log("getAddressInfo: ", response.json());            
            if(response.json() != null){
              if(response.json()['status']){
                this.setStatusToComp('BC');
              }                
              return response.json();
            }
          }).catch(error => Observable.throw(error.json()));
  }
  
  isRenterfileExists(typ){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.configService.getBasePath() + '/users/' + this.auth.getUserId() + '/document/'+typ,options)
    .map((response : Response)=>{
      return response.json()
    })
    .catch((error:any) => Observable.throw(error));
  }

  getFileStatus(fileType){
    //console.log("service file type:",fileType);
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/users/'+this.auth.getUserId() +'/document/getstatus/'+fileType; 
      return this.http.get(myUrl, options)
        .map((response: Response) => {
              if(response.json()) {
                //console.log("service map function:",fileType.substr(0, 3));
                this.setStatusToComp(fileType.substr(0, 3));
              }
              else this.setStatusToSkip(fileType.substr(0, 3));
              return response.json();
            })
        .catch(error => Observable.throw(error))
  }

  getPlaidTransaction(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });   
    return this.http.get(this.configService.getBasePath() + '/users/'+this.auth.getUserId()+'/fetchtransactions/',options)
    .map((response : Response)=>{
      response= response.json();
      if(response) {
        console.log('Obtained through plaid');
        this.setStatusToComp('BS1');
        this.setStatusToComp('BS2');
      }
      return response;
    })
    .catch((error:any) => Observable.throw(error.json()));
  }

  getW2(){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.configService.getBasePath() + '/users/'+this.auth.getUserId()+'/fetchw2',options)
    .map((response : Response)=>{
      response=response.json();
      if(response){
        this.setStatusToComp('W2')
      }
      return response;
    })
    .catch((error:any) => Observable.throw(error));
  }

  resetInfo(){
      this.progress = {
        "PER":{"comp": false, "skip": false},
        "SSN":{"comp": false, "skip": false},
        "EMP":{"comp": false, "skip": false},
        "W2":{"comp": false, "skip": false},
        "CC":{"comp": false, "skip": false},
        "ID":{"comp": false, "skip": false},
        "PS1":{"comp": false, "skip": false},
        "PS2":{"comp": false, "skip": false},
        "BS1":{"comp": false, "skip": false},
        "BS2":{"comp": false, "skip": false},
        "BK":{"comp": false, "skip": false},
        "AC":{"comp": false, "skip": false},
        "BC":{"comp": false, "skip": false}
    };
    this.cookies.put('progress',JSON.stringify(this.progress));
  }

  resetProgress(){
    if(!this.progress || !this.progress['PER']){
      this.progress = {
        "PER":{"comp": false, "skip": false},
        "SSN":{"comp": false, "skip": false},
        "EMP":{"comp": false, "skip": false},
        "W2":{"comp": false, "skip": false},
        "CC":{"comp": false, "skip": false},
        "ID":{"comp": false, "skip": false},
        "PS1":{"comp": false, "skip": false},
        "PS2":{"comp": false, "skip": false},
        "BS1":{"comp": false, "skip": false},
        "BS2":{"comp": false, "skip": false},
        "BK":{"comp": false, "skip": false},
        "AC":{"comp": false, "skip": false},
        "BC":{"comp": false, "skip": false}
      };
      this.cookies.put('progress',JSON.stringify(this.progress));
      
    }
    if(this.auth.isLoggedIn() && !this.isComplete('PER')) 
      this.updateProgress().subscribe();
  }

  updateProgress(){
    let infos: any = [];
    let files: any = [];
    if(Number(this.auth.getUserRole()) == Number(CONSTANTS.userRole.renter)){
      files = [{type:"W2"},{type:"ID"},{type:"PS1"},{type:"PS2"},{type:"BS1"},{type:"BS2"}]; 
    }else{
      files = [{type:"ID"},{type:"BK1"},{type:"BK2"}]; 
    } 
    for(let i=0;  i<  files.length; i++){
      infos.push(this.getFileStatus(files[i].type)
      ) 
    } 
    infos.push(this.getPersonalInfo()); 
    infos.push(this.getCompanyInfo());
    infos.push(this.getSSNInfo());
    infos.push(this.getCreditInfo());
    infos.push(this.getAddressInfo());
    infos.push(this.getBackgroundInfo());
    infos.push(this.getPlaidTransaction());
    infos.push(this.getW2());
    var response=[];
    return Observable.onErrorResumeNext(infos)
    .map((res:Response) => { return res; }
    ).catch(error => Observable.throw(error))           
     
  }

  setStatusToComp(type){
    //console.log("Setting Type:",type);
    //console.log("this.progress:",this.progress);
    this.progress = this.cookies.getObject('progress');
    //console.log("this.progress:",this.progress);
    this.progress[type].comp = true;
    this.progress[type].skip = false;
    this.cookies.put('progress',JSON.stringify(this.progress));
  }

  resetComp(type){
    this.progress = this.cookies.getObject('progress');
    this.progress[type].comp = false;
    this.cookies.put('progress',JSON.stringify(this.progress));
  }

  setStatusToSkip(type){
    this.progress = this.cookies.getObject('progress');
    if(!this.progress[type].comp) this.progress[type].skip = true;
    this.cookies.put('progress',JSON.stringify(this.progress));
  }

  resetSkip(type){
    this.progress = this.cookies.getObject('progress');
    this.progress[type].skip = false;
    this.cookies.put('progress',JSON.stringify(this.progress));
  }

  isComplete(type){
   // console.log("isComplete fun:",type);
    return this.cookies.getObject('progress')[type]['comp'];
  }

  isSkipped(type){
    return this.cookies.getObject('progress')[type]['skip'];
  }

  canApply(){
    let statusArray=[];    
    let types = ["PER","SSN","EMP","W2","CC","ID","PS1","PS2","BS1","BS2","CC","AC","BC" ];
    // types.forEach(function(itm,idx){
    //   if(!this.isComplete(itm)) return false;
    //   if(idx==types.length-1) return true;
    // }, this)
    types.forEach(function(item){ 
      //console.log("canApply func---> ",item, this.isComplete(item))     
      if(!this.isComplete(item)) {       
        statusArray.push(false)
      }
      else statusArray.push(true);
    },this)
    //console.log("Cookie",this.cookies.getObject('progress'))
    //console.log("statusArray",statusArray)
    if(statusArray.indexOf(false) > -1) return false;
    else return true;
  }

  shareReport(bookmarkId){
    var data={
      Bookmark_ID:bookmarkId,
      User_Credit_Info_ID:this.getCreditInfoId(),
      Status:'Share'
    }
    //console.log(data);
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.put(this.configService.getBasePath() + '/creditcheck/share' ,data,options)
    .map((response : Response)=>{
      return response;
    })
    .catch((error:any) => Observable.throw(error));
  }

  setPopUp(){
    this.showPopup = true;
  }
  getPopUp(){
    return this.showPopup;
  }

  resetPopUp(){
    this.showPopup = false;
  }
}
