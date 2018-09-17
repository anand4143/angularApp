/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegisterPayInfoService } from './register-pay-info.service';

describe('RegisterPayInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterPayInfoService]
    });
  });

  it('should ...', inject([RegisterPayInfoService], (service: RegisterPayInfoService) => {
    expect(service).toBeTruthy();
  }));
});
