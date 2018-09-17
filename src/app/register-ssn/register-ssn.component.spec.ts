/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegisterSsnComponent } from './register-ssn.component';
require('../app.unittest.spec');
describe('RegisterSsnComponent', () => {
  let component: RegisterSsnComponent;
  let fixture: ComponentFixture<RegisterSsnComponent>;
  let compile: any;
 


  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compile = fixture.debugElement.nativeElement;
    component.rgssnMdl = {
        'Address_1' : 'Gwaltoli kanpur 11 HNo',
        'User_SSN' : '222-222-2222',
        'User_DOB' : '11/11/2017'
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have address defined',() => {
    expect(component.rgssnFrm.controls['Address_1']).toBeDefined();
  });

  it('should have address not empty',() => {
    component.rgssnFrm.controls['Address_1'].setValue('');
    fixture.detectChanges();
    expect(component.rgssnFrm.controls['Address_1'].valid).toBe(false);    
  });

  it('renter user should redirect to /user/register-employment',() => {
    
  });

});





