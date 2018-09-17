/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('Service: Config ,', () => {  
 let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService]
    });
  });
  
  beforeEach(inject([ConfigService],s=>{
      service=s;
  }));

  it('should ...', inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));

  it('no of records should be numeric',()=>{
    let noOfRec=service.getNumRecordsPerPage();
    expect(noOfRec).toBeGreaterThan(0);
  });
  
  it('the base path should be string',()=>{
    let basepath=service.getBasePath();
    expect(basepath.length).toBeGreaterThan(0);
  });

  it('the datepicker options must be an true',()=>{
    let pickeroptions=service.getDatePickerOptions();
    expect(pickeroptions).toBeTruthy;
  });

});
