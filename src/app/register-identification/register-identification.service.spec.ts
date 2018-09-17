/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegisterIdentificationService } from './register-identification.service';

describe('RegisterIdentificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterIdentificationService]
    });
  });

  it('should ...', inject([RegisterIdentificationService], (service: RegisterIdentificationService) => {
    expect(service).toBeTruthy();
  }));
});
