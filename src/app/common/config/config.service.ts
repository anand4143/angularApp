import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'

@Injectable()
export class ConfigService {
  private basePath: string;
  private access_token:string;
  private pageTabSize: number;
  private numOfRecords: number;
  private myDatePickerOptions:any;

  constructor() { 
    this.myDatePickerOptions={showTodayBtn:true,dateFormat:'mm-dd-yyyy'};
  }

  getBasePath(): string {
    return environment.basePath;
  }

  getNumRecordsPerPage(): number{
    return environment.numOfRecords;
  }

  getDatePickerOptions():any{
    return this.myDatePickerOptions;
  }

  getAccessToken(){
    return environment.access_token;
  }

  getCaptchaKey(){
    return environment.recaptchaKey;
  }
  getS3Bucket(){
    return environment.s3bucket;
  }
  getHelloSignClientID(){
    return environment.helloSign_clientID;
  }
}
