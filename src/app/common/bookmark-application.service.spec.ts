/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BookmarkApplicationService } from './bookmark-application.service';

describe('BookmarkApplicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookmarkApplicationService]
    });
  });

  it('should ...', inject([BookmarkApplicationService], (service: BookmarkApplicationService) => {
    expect(service).toBeTruthy();
  }));
});
