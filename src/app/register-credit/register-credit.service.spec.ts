/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegisterCreditService } from './register-credit.service';

describe('RegisterCreditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterCreditService]
    });
  });

  it('should ...', inject([RegisterCreditService], (service: RegisterCreditService) => {
    expect(service).toBeTruthy();
  }));
});
