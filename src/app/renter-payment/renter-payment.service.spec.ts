/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RenterPaymentService } from './renter-payment.service';

describe('RenterPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RenterPaymentService]
    });
  });

  it('should ...', inject([RenterPaymentService], (service: RenterPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
