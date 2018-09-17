import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { HttpService } from '../../common';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class FileService {
  filemaxSize: number = 3 * 1024 * 1024;
  fileminSize: number = 32 * 1024;
  allowedMimeType = ['pdf', 'jpg', 'png'];

  constructor(
    private http: HttpService,
    private cookies: CookieService,
    private config: ConfigService,
    private auth: AuthService
  ) { }

  Upload(file, apitype) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    console.log("file:", file);
    console.log("file name:", file.name);
    console.log("file name:", file.name);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.config.getBasePath() + '/users/' + this.auth.getUserId() + '/document/' + apitype, formData, options)
      .map((response: Response) => {
        return response.json();
      })
      .catch(error => Observable.throw(error))

  }

  isfileExists(apitype) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.config.getBasePath() + '/users/' + this.auth.getUserId() + '/document/' + apitype, options)
      .map((response: Response) => {
        console.log("isfileExists:", response);
        return response.json()
      })
      .catch((error: any) => Observable.throw(error));
  }

  getUserFiles(apitype) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.config.getBasePath() + '/users/' + this.auth.getUserId() + '/document/' + apitype, options)
      .map((response: Response) => {
        return response.json()
      })
      .catch((error: any) => Observable.throw(error));
  }

  deleteUserFile(apitype) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.config.getBasePath() + '/users/' + this.auth.getUserId() + '/document/' + apitype, options)
      .map((response: Response) => {
        console.log("Delete Function in Service:", response);
        return response;
      })
      .catch((error: any) => Observable.throw(error));
  }

  getFile(apitype) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.config.getBasePath() + '/users/' + this.auth.getUserId() + '/document/' + apitype + '/download', options)
      .map((response: Response) => {
        console.log("file service: ", response);
        return response
      })
  }

  downloadFile(filename, typ) {
    this.getFile(typ)
      .subscribe(
      (userFile) => {
        var fileToDownload: any = userFile;
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.download = filename;
        link.href = 'data:application/octet-stream;base64,' + fileToDownload._body;
        link.click();
        document.body.removeChild(link);
      },
      (err) => {
        console.log(err);
      }
      )
  }

  getFileById(fileId) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.config.getBasePath() + '/applications/document/' + fileId + '/download', options)
      .map((response: Response) => {
        console.log("file service: ", response);
        return response
      })
  }

  downloadFileById(filename, fileId) {
    this.getFileById(fileId)
      .subscribe(
      (userFile) => {
        var fileToDownload: any = userFile;
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.download = filename;
        link.href = 'data:application/octet-stream;base64,' + fileToDownload._body;
        link.click();
        document.body.removeChild(link);
      },
      (err) => {
        console.log(err);
      }
      )
  }

  validateFile(file) {
    var validation = {
      size: false,
      type: false
    };
    if (file.size < this.filemaxSize && file.size > this.fileminSize) validation.size = true;
    if (this.allowedMimeType.indexOf((this.getFiletype(file.name))) > -1) {
      console.log("In");
      validation.type = true;
    }
    return validation;
  }

  getFiletype(filename) {
    var temp = filename.split(".");
    console.log("Type", temp[(temp.length) - 1])
    return temp[(temp.length) - 1];
  }

  UploadDocument(file, bkmrkAppID) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.config.getBasePath() + '/applications/' + bkmrkAppID + '/document', formData, options)
      .map((response: Response) => {
        return response.json();
      })
      .catch(error => Observable.throw(error))

  }
  
  deleteDocument(docId) {
   let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.config.getBasePath() + '/applications/document/' + docId + '/remove', {}, options)
      .map((response: Response) => {
        console.log("deleteDocument - response.json() : ", response)
        return response;
      })
      .catch(error => Observable.throw(error))
  }

  getDocuments(bkmrkAppID) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.config.getBasePath() + '/applications/' + bkmrkAppID + '/documents', options)
      .map((response: Response) => {
        console.log("all fils based on appID: ", response);
        return response.json();
      })
  }

  downloadDocumentFile(docId){
    console.log("docID",docId);
    this.getDocumentsFiles(docId)
      .subscribe(
      (userFile) => {
        console.log("userFile--:",userFile);
        var fileToDownload: any = userFile;
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.download = fileToDownload.Document_Name
        link.href = 'data:application/octet-stream;base64,' + fileToDownload._body;
        link.click();
        document.body.removeChild(link);
      },
      (err) => {
        console.log(err);
      }
      )
  }

  getDocumentsFiles(docId){
    console.log("download function in file service:",docId);
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.config.getBasePath() + '/applications/document/' + docId + '/download', options)
      .map((response: Response) => {
        return response.json(); 
      })
      .catch(error => Observable.throw(error.json()));

  }

  signDocument(signObject,docID){
    //console.log("signObject:",signObject);
    //console.log("docID:",docID);
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.config.getBasePath() + '/applications/document/' + docID + '/sign', signObject , options)
      .map((response: Response) => {
        return response.json(); 
      }).catch(error => Observable.throw(error));
  }

  sendDocumentToBroker(bkmrkAppID){
     let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.config.getBasePath() + '/applications/' + bkmrkAppID + '/doctobroker',null , options)
      .map((response: Response) => {
        return response.json(); 
      }).catch(error => Observable.throw(error));
  }

  curlHelloSign(DocumentSignatureID){
   return this.http.get('https://ac8b78b38c7b7a4d134a8a64e909b079a74e43016b3a9ce934c01910041c8193:@api.hellosign.com/v3/embedded/sign_url/'+DocumentSignatureID)
     .map((response: Response) => {
       return response.json();
     })
     .catch(error => Observable.throw(error.json()));
 }

}


