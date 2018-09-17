/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserApplyComponent } from './user-apply.component';

describe('UserApplyComponent', () => {
  let component: UserApplyComponent;
  let fixture: ComponentFixture<UserApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
