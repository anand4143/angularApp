import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService, AuthService } from '../common';
import { HttpService } from '../common';


@Injectable()
export class RegisterIdentificationService {

  constructor(
    private http: HttpService,
    private cfgSrv: ConfigService,
    private auth: AuthService
  ) { }

  documentReport: any = {};
  documentStatus: boolean = true;
  documentRecord: any = {};

  resetAll() {  
    this.documentRecord = {};
    this.documentReport = {};
    this.documentStatus = true;
  }


  setDocumentRecord(record) {
    this.documentRecord = record
  }

  getDocumentRecord() {
    if (this.documentRecord) return this.documentRecord;
  }

  setDocumentStatus(status) {
    this.documentStatus = status;
  }

  getDocumentStatus() {
    //console.log("getDocumentStatus",this.documentStatus);
    if (this.documentStatus) return this.documentStatus;
  }

  setDocumentReport(report) {
    this.documentReport = report
  }

  getDocumentReport() {
    if (this.documentReport) return this.documentReport;
  }


  documentCheck(data) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/check/document', data, options)
      .map((response: Response) => {
        response = response.json();

        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  uploadOnfido() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/check/document/upload', null, options)
      .map((response: Response) => {
        response = response.json();
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  getDocumentVerificationStatus() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/get/docverificationstatus', options)
      .map((response: Response) => {
        response = response.json();      
        if (response) {
          this.setDocumentRecord(response['record']);
          this.setDocumentStatus(response['status']);
        } else {
          this.documentRecord = null;
          this.documentStatus = false;
        }
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  getReport(type) {
    console.log('type', type)
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/check/document/type/' + type, options)
      .map((response: Response) => {
        response = response.json();       
        if (type == 'document') this.setDocumentReport(response);
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }


}
