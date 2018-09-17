/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GobackbuttonService } from './gobackbutton.service';

describe('GobackbuttonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GobackbuttonService]
    });
  });

  it('should ...', inject([GobackbuttonService], (service: GobackbuttonService) => {
    expect(service).toBeTruthy();
  }));
});
