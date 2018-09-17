import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConfigService,AuthService } from '../common';
import { HttpService } from '../common';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class BookmarkApplicationService {
  broker                            : any = {};
  Bookmark_Application              : any = {};
  Bookmark_ID                       : string = '';
  Bookmark_Application_ID           : string  = '';
  applications                      : any = [];
  landlordInfo                      : any ;
  CurrentBookmark                   : any = {};
  renterInfo                        : any = {};
  brokerInfo                        : any = {};
  creditShareStatus                 : boolean;
  constructor(
    private http:HttpService,
    private configService:ConfigService,
    private auth: AuthService
  ) { }

  resetAll(){
    this.broker= {}
    this.Bookmark_Application= {}
    this.Bookmark_ID= '';
    this.Bookmark_Application_ID= '';
    this.landlordInfo ={};
    this.CurrentBookmark= {};  
    this.renterInfo = {};
    this.creditShareStatus=false;
    this.applications=[];
  }

  getBrokerDetails(bookmarkId: any){ 
    if(!bookmarkId) return;
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url     = this.configService.getBasePath() + '/applications/' + bookmarkId + '/getbroker'; 
    this.http.get(url, options)
        .subscribe((result)=>{ 
          this.broker = result.json();
        });
  }

  setSelectedBookmarkId(bkmrkID){
    this.Bookmark_ID = bkmrkID;
  }

  getSelectedBookmarkId(){
    return this.Bookmark_ID;
  }

  setCreditShareStatus(status){
    this.creditShareStatus = status;
  }

  getCreditShareStatus(){
    return this.creditShareStatus;
  }

  getBrokerName(){
    if(this.broker) return this.broker.User_First_Name + ' ' + this.broker.User_Last_Name;
    return '';
  }

  getBrokerContact(){
    if(this.broker) return this.broker.Email_Address + ' / ' + this.broker.Contact_Num;
    return '';
  }
  
  getAppliedBookmarks(){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/broker/'+this.auth.getUserId() + '/bookmarks/applied';
    return this.http.get(url, options)
    .map((response:Response) => response.json());  
  }

  getApplicationsList(){
    return this.applications;
  }

  resetApplications(){
    this.applications = [];
  }

  setApplications(propId){
    this.applications = [];
    this.getApplications(propId).subscribe((applic)=>Array.prototype.push.apply(this.applications,applic));
    // this.getAppliedBookmarksForProperty(propId).subscribe((applic)=>Array.prototype.push.apply(this.applications,applic));
  }

  setClientListingsForLandlord(clientID){
    this.applications = [];
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/all/landlord/'+this.auth.getUserId()+'/renter/'+clientID;
    return this.http.get(url, options)
    .map((response:Response) => {this.applications = response.json()}); 
  }

  setClientListingsForBroker(clientID){
    this.applications = [];
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/all/broker/'+this.auth.getUserId()+'/renter/'+clientID;
    return this.http.get(url, options)
    .map((response:Response) => {this.applications = response.json()}); 
  }

  getApplications(propId){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/all/property/'+propId;
    return this.http.get(url, options)
    .map((response:Response) => response.json());  
  }

  getAppliedBookmarksForProperty(propId) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/bookmarks/all/property/' + propId;
    return this.http.get(url, options)
      .map((result) => result.json());
  }

  getBookmarks(status){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/broker/'+this.auth.getUserId() + '/status/' + status;
    return this.http.get(url, options)
    .map((response:Response) => response.json());
  }

  getApplication(){
    console.log("bookmark id app service:",this.Bookmark_ID);
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/getapplication/' + this.Bookmark_ID;// d6497485-bda3-4459-9c4a-15115e5d5238
    return this.http.get(url, options)
    .map((response:Response) => {
      this.Bookmark_Application = response.json();
      console.log("bookmark app:=",this.Bookmark_Application);
      this.Bookmark_Application_ID = this.Bookmark_Application.Bookmark_Application_ID;
      return this.Bookmark_Application;
    });
  }

  getCurentApplication(){
    
    return this.Bookmark_Application;
  }

  getApplicationStatus(){
    //console.log("Bookmark_Application_Status::",this.Bookmark_Application.Bookmark_Application_Status);
    return this.Bookmark_Application.Bookmark_Application_Status;
  }

  getApplicationId(){
    console.log("Bookmark_Application_ID::",this.Bookmark_Application_ID);
    return this.Bookmark_Application_ID;
  }

  
  setCurrentBookmark(bkmrk){
    this.CurrentBookmark = bkmrk;
    this.setRenterInfo(bkmrk.Bookmark_ID)
    .subscribe(
      (response) => {
         this.renterInfo = {
           "name" : response.User_First_Name + ' ' + response.User_Last_Name,
           "email" : response.Email_Address,
           "phno" : response.Contact_Num
          };
      }
    );
  }

  setBookmarkRenterInfo(bkmrkId){
    this.setRenterInfo(bkmrkId)
    .subscribe(
      (response) => {
        sessionStorage.setItem("BookmarkRenterId", response.Renter_User_ID);
         this.renterInfo = {
           "name" : response.User_First_Name + ' ' + response.User_Last_Name,
           "email" : response.Email_Address,
           "phno" : response.Contact_Num
          };
      }
    );
  }

  getCurrentBookmark(){
    return this.CurrentBookmark;
  }

  setRenterInfo(bkmrkId){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/bookmarks/' + bkmrkId + '/getuser';
    return this.http.get(url, options)
    .map((response:Response) => {        
      return  response.json();
    });
  }
  getRenterInfo(){
    return this.renterInfo;
  }

  checkBroker(bkmrkId){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/getapplication/' + bkmrkId;// d6497485-bda3-4459-9c4a-15115e5d5238
    return this.http.get(url, options)
    .map((response:Response) => {  
      var bookmarkApp = response.json();
      if(bookmarkApp.Broker_User_ID == this.auth.getUserId()) return true;
      return false; 
    });
  }

  getMasterVerificationItems(){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/masterdetails';
    return this.http.get(url, options)
    .map((response:Response) => {
      return response.json();
    });
  }

  getUserVerificationItems(){
    //this.Bookmark_Application_ID = 'a9bd0b2e-1606-437c-b3b6-4dd0aafa198c';
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/verificationdetails/' + this.Bookmark_Application_ID;
    return this.http.get(url, options)
    .map((response:Response) => {
      return response.json();
    });
  }

  // getUserVerificationStatus(item){
  //   console.log("getUserVerificationStatus:",item);
  //   let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
  //   let options = new RequestOptions({ headers: headers });
  //   let url= this.configService.getBasePath() + '/applications/verify';
  //   let verifItem = {};
  //   verifItem['Bookmark_Application_ID'] = this.Bookmark_Application_ID;
  //   verifItem['Master_Verification_ID'] = item.Master_Verification_ID;
  //   verifItem['Application_Verification_Status'] = item.Application_Verification_Status;
  //   verifItem['User_ID'] = this.auth.getUserId();

  //   return this.http.post(url, verifItem, options)
  //   .map((response:Response) => {});
  // }

  setUserVerificationStatus(item, status){
    console.log("verification item:",item);
    console.log("verification status:",status);
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/verify';
    let verifItem = {};
    verifItem['Bookmark_Application_ID'] = this.Bookmark_Application_ID;
    verifItem['Master_Verification_ID'] = item.Master_Verification_ID;
    verifItem['Application_Verification_Status'] = status;
    verifItem['User_ID'] = this.auth.getUserId();

    return this.http.post(url, verifItem, options)
    .map((response:Response) => {
      console.log("success verify result",response);

    });
  }

  verifyAll(){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/verify/all';
    let verifItem = {};
    verifItem['Bookmark_Application_ID'] = this.Bookmark_Application_ID;
    verifItem['User_ID'] = this.auth.getUserId();
    console.log("verifItem:",verifItem);
    return this.http.post(url, verifItem, options)
    .map((response:Response) => {
      console.log("success verify all result",response);

    }).catch((error => Observable.throw(error.json())));
  }

  updateUserVerificationStatus(verificObject){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url= this.configService.getBasePath() + '/applications/verificationdetails/' + this.Bookmark_Application_ID;
    let postObject:any = {};

    //Create the POST Object as per the API docs


    return this.http.post(url, postObject, options)
    .map((response:Response) => response.json());
  }

  bookmarkAccept(bkmrkId, bkmrk){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let bkmarkApplication: any = {};
    bkmarkApplication.Broker_User_ID = this.auth.getUserId();
    bkmarkApplication.Bookmark_ID = bkmrkId;
    bkmarkApplication.Property_ID = bkmrk.Property_ID;
    bkmarkApplication.Renter_ID = bkmrk.Renter_User_ID;
    let url= this.configService.getBasePath()+ '/applications/accept';
    return this.http.post(url, bkmarkApplication, options)
        .map((result)=>{});
  }

  getRenterPersonalInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/users/'+ sessionStorage.getItem("BookmarkRenterId") +'/personalinfo';      
      return this.http.get(url, options)
          .map((response: Response) => {
           return response.json();
          });
  }

  getRenterSSNInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/users/'+ sessionStorage.getItem("BookmarkRenterId") +'/ssn';      
      return this.http.get(url, options)
          .map((response: Response) => response.json());
  }

  isRenterfileExists(typ){
    let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
    let options = new RequestOptions({ headers: headers }); 
    return this.http.get(this.configService.getBasePath() + '/users/' + sessionStorage.getItem("BookmarkRenterId") + '/document/'+typ,options)
    .map((response : Response)=>{
      return response.json()
    })
    .catch((error:any) => Observable.throw(error));
  }

  getRenterCompanyInfo(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      let url= this.configService.getBasePath() + '/users/'+ sessionStorage.getItem("BookmarkRenterId") +'/employment';      
      return this.http.get(url, options)
          .map((response: Response) => response.json());
  }

  getRenterFileStatus(fileType){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/users/'+ sessionStorage.getItem("BookmarkRenterId") +'/document/getstatus/'+fileType; 
      return this.http.get(myUrl, options)
        .map((response: Response) => response.json());
  }

  getLandlordApplications(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/applications/landlord/'+this.auth.getUserId() + '/bookmarks' 
      return this.http.get(myUrl, options)
        .map((response: Response) => response.json());
  }

  getLandlordContracts(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/applications/landlord/'+this.auth.getUserId() + '/contracts' 
      return this.http.get(myUrl, options)
        .map((response: Response) => response.json());
  }


getFile(apitype){
   let headers = new Headers({ 'Authorization':'Bearer '+ this.auth.getToken() });
   let options = new RequestOptions({ headers: headers }); 
   return this.http.get( this.configService.getBasePath() +'/users/'+sessionStorage.getItem("BookmarkRenterId") +'/document/'+apitype+'/download',options)
   .map((response : Response)=>{return response})
 }

 downloadFile(filename,typ){
   this.getFile(typ)
   .subscribe(
      (userFile) =>  {
           var fileToDownload: any = userFile;                  
           var link = document.createElement('a');
           document.body.appendChild(link);
           link.download = filename;
           link.href = 'data:application/octet-stream;base64,' + fileToDownload._body;
           link.click();
           document.body.removeChild(link);
      },
      (err) => {
        
      }
    )
  } 

  //forward documents to renter for signing
  forwardToRenter(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() +'/applications/'+ this.Bookmark_Application_ID + '/doctosign'; 
      return this.http.put(myUrl,{}, options)
        .map((response: Response) => response)
        .catch((error => Observable.throw(error.json())));
  }

  //add landlord btn
  approveApplication(landlord,verification_costs){
      var data={
        Broker_User_ID:this.auth.getUserId(),       
        Verification_Costs:verification_costs,
        Bookmark_ID:this.Bookmark_Application.Bookmark_ID
      }     
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() +'/applications/approve/'+ this.Bookmark_Application_ID; 
      return this.http.put(myUrl,data, options)
        .map((response: Response) => response)
        .catch((error => Observable.throw(error.json())));
  }

  //save btn click
  saveVerificationCosts(verification_costs){
      var data={
        Broker_User_ID:this.auth.getUserId(),       
        Verification_Costs:verification_costs
      }
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() +'/applications/'+ this.Bookmark_Application_ID +'/saveverificationcost'; 
      return this.http.put(myUrl,data, options)
        .map((response: Response) => response )
        .catch((error => Observable.throw(error)));
  }

  //on nginit
  getLandlordDetails(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/applications/landlord/'+this.Bookmark_ID; 
      return this.http.get(myUrl, options)
      .map((response: Response) => {
        console.log("getLandlordDetails response:",response);
           return response.json();
          });
  }

  //on nginit
  getBrokerPaymentDetails(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/applications/'+this.auth.getUserId()+'/getBrokerPayment'; 
      return this.http.get(myUrl, options)
        .map((response: Response) => response.json());
  }

  //on focussing out after a valid mail
  findLandlord(email){
        var data={
          "Email.Email_Address":email
        }
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
        let options = new RequestOptions({ headers: headers });
        var myUrl= this.configService.getBasePath() + '/applications/findlandlord';
        return this.http.put(myUrl, data,options)
          .map((response: Response) => response.json());
    }

  //on click of sendTOLandlord button
  sendToLandlord(landlord){
      //landlordData  = this.getLandlordInfo()  ? this.getLandlordInfo(): landlord;
      var data  = {
        Broker_User_ID:this.auth.getUserId(),
        Bookmark_ID:this.Bookmark_ID,
        Landlord:landlord
      }
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/applications/sendToLandlord/'+ this.Bookmark_Application_ID;
      return this.http.put(myUrl, data,options)
        .map((response: Response) => response)
       .catch((error:any) => Observable.throw(error.json()));
     
  }

  setLandlordInfo(landlord){
    this.landlordInfo = landlord;     
  }
  getLandlordInfo(){
   return this.landlordInfo;
  }
  // setlandlordPaymentInfo(lndlrdPaymentInfo){
  //    this.landlordPaymentInfo = lndlrdPaymentInfo;
  // }
  // getlandlordPaymentInfo(){
  //  return this.landlordPaymentInfo;
  // }

  // setbrokerPaymentInfo(brkPaymentInfo){
  //    this.brokerPaymentInfo = brkPaymentInfo;
  // }
  // getbrokerPaymentInfo(){
  //  return this.brokerPaymentInfo;
  // }

  landlordEmailVerification(){
   console.log("hello bookmark service line 299");
  }

  releaseApplication(applicationObject){  
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() +'/applications/release/application/'; 
      return this.http.put(myUrl,applicationObject, options)
        .map((response: Response) => response);
 }

 landlordApprove(data){
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    var myUrl= this.configService.getBasePath() +'/contract/landlord/approve/' + this.auth.getUserId(); 
    return this.http.put(myUrl,data, options)
      .map((response: Response) => response);
 }


  checkCreditReport(){
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl= this.configService.getBasePath() + '/creditcheck/share/'+this.Bookmark_ID+'/isEnabled'; 
      return this.http.get(myUrl, options)
        .map((response: Response) => {
          response=response.json();
          this.setCreditShareStatus(response['status'])
          console.log("Share Status",this.getCreditShareStatus())
          return response;
        });
  }

}
