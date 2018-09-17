import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../common';
import { ConfigService,AuthService, BookmarkApplicationService } from '../common';
import { CONSTANTS } from '../app.constants';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class ContractInfoService {

  constructor(
    private http:HttpService,
    private configService:ConfigService,
    private auth: AuthService,
  ) { }

  fetchBookmark(bkmId){
   let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
   let options = new RequestOptions({ headers: headers });
   let url     = this.configService.getBasePath() + '/bookmarks/getproperty/' + bkmId;
   return this.http.get(url, options)
    .map((response: Response) => {            
      return response.json();     
    })
    .catch((error:any) => Observable.throw(error.json())); 
  }

  createAndApprove(data){    
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url     = this.configService.getBasePath() + '/contract/landlord/approve';
    return this.http.put(url, data,options)
      .map((response: Response) => {            
        return response.json();     
      })
      .catch((error:any) => Observable.throw(error.json())); 
  }

  updateContract(data){    
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url     = this.configService.getBasePath() + '/contract/landlord/' + this.auth.getUserId() + '/updateContract';
    return this.http.put(url, data,options)
      .map((response: Response) => {            
        return response;     
      })
      .catch((error:any) => Observable.throw(error.json())); 
  }
}
