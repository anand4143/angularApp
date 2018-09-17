/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddressCheckService } from './address-check.service';

describe('AddressCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressCheckService]
    });
  });

  it('should ...', inject([AddressCheckService], (service: AddressCheckService) => {
    expect(service).toBeTruthy();
  }));
});
