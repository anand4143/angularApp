import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigService, AuthService } from '../common';
import { HttpService } from '../common';


@Injectable()
export class AddressCheckService {

  addressRecord: any = {}
  ssnRecord: any = {}
  addressStatus: boolean = true;
  ssnStatus: boolean = true
  addressReport: any = {}
  ssnReport: any = {}
  documentReport: any = {};
  documentStatus: boolean = true;
  documentRecord: any = {};
  constructor(
    private http: HttpService,
    private cfgSrv: ConfigService,
    private auth: AuthService
  ) { }

  resetAll() {
    this.addressRecord = {}
    this.ssnRecord = {}
    this.addressStatus = true;
    this.ssnStatus = true
    this.addressReport = {}
    this.ssnReport = {}
    this.documentRecord = {};
    this.documentReport = {};
    this.documentStatus = true;
  }

  setAddressRecord(record) {
    this.addressRecord = record
  }

  getAddressRecord() {
    if (this.addressRecord) return this.addressRecord;
  }

  setAddressStatus(status) {
    this.addressStatus = status;
  }

  getAddressStatus() {
    if (this.addressStatus) return this.addressStatus;
  }

  setAddressReport(report) {
    this.addressReport = report
  }

  getAddressReport() {
    if (this.addressReport) return this.addressReport;
  }

  setSSNRecord(record) {
    this.ssnRecord = record
  }

  getSSNRecord() {
    if (this.ssnRecord) return this.ssnRecord;
  }

  setSSNStatus(status) {
    this.ssnStatus = status;
  }

  getSSNStatus() {
    //console.log('this.ssnStatus',this.ssnStatus);
    if (this.ssnStatus) return this.ssnStatus;
  }

  setSSNReport(report) {
    this.ssnReport = report
  }

  getSSNReport() {
    console.log("this.ssnReport: ", this.ssnReport)
    if (this.ssnReport) return this.ssnReport;
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
    if (this.documentStatus) return this.documentStatus;
  }

  setDocumentReport(report) {
    this.documentReport = report
  }

  getDocumentReport() {
    if (this.documentReport) return this.documentReport;
  }




  addressCheck() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/check/identity', null, options)
      .map((response: Response) => {
        response = response.json();
        if (response) this.setAddressReport(response['reports'][0]);
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  ssnCheck(data) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/check/ssn', data, options)
      .map((response: Response) => {
        response = response.json();
        if (response) this.setSSNReport(response['reports'][0]);
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  getGender() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.cfgSrv.getBasePath() + '/users/' + this.auth.getUserId() + '/gender', options)
      .map((response: Response) => {
        response = response.json();
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }



  documentCheck() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/check/document', null, options)
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

  getAll() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.cfgSrv.getBasePath() + '/addresscheck/' + this.auth.getUserId() + '/get/all', options)
      .map((response: Response) => {
        response = response.json();
        // if (response[0]) {
        //   this.setAddressRecord(response[0].record);
        //   this.setAddressStatus(response[0].status);
        // } else {
        //   this.addressRecord = null;
        //   this.addressStatus = false;
        // }
        if (response) {
          this.setSSNRecord(response['record']);
          this.setSSNStatus(response['status']);
        } else {
          this.ssnRecord = null;
          this.ssnStatus = false;
        }
        // if (response[2]) {
        //   this.setDocumentRecord(response[2].record);
        //   this.setDocumentStatus(response[2].status);
        // } else {
        //   this.documentRecord = null;
        //   this.documentStatus = false;
        // }
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  getReport(type,userId) {
    console.log('type', type)
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.cfgSrv.getBasePath() + '/addresscheck/' + userId + '/check/document/type/' + type, options)
      .map((response: Response) => {
        response = response.json();
        if (type == 'ssn') {
          this.setSSNReport(response);
        }
        // if (type == 'idenity') this.setAddressReport(response);
        // if (type == 'document') this.setDocumentReport(response);
        return response;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

}