/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackgroundCheckService } from './background-check.service';

describe('BackgroundCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackgroundCheckService]
    });
  });

  it('should ...', inject([BackgroundCheckService], (service: BackgroundCheckService) => {
    expect(service).toBeTruthy();
  }));
});
