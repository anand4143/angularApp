/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContractInfoService } from './contract-info.service';

describe('ContractInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractInfoService]
    });
  });

  it('should ...', inject([ContractInfoService], (service: ContractInfoService) => {
    expect(service).toBeTruthy();
  }));
});
