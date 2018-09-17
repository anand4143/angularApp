/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';

// require('../app.unittest.spec');

// describe('Component:LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;
//   let compiled: any;
  
//   beforeEach(() => {
//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//     compiled = fixture.debugElement.nativeElement;
//     component.lnMdl = {
//                         "Email_Address":"anand7feb1254@mailinator.com",
//                         "User_Password":"Admin@123",
//                       };
//      fixture.detectChanges();
//   });

//   it('should create Login Component',() => {
//     expect(component).toBeTruthy();
//   });

//   /* Email feild test cases */

//     it('should have email defined', () => {
//         expect(component.lnFrm.controls['Email_Address']).toBeDefined();
//     });
    
//     it('submit button should be disabled when email is empty', () => {
//         //1. valid case
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
//         expect(component.lnFrm.controls['Email_Address'].hasError('required')).toBe(false);
//         //2. empty case
//         component.lnFrm.controls['Email_Address'].setValue("");
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         expect(component.lnFrm.controls['Email_Address'].hasError('required')).toBe(true);
//         //3. invalid email without @ case
//         component.lnFrm.controls['Email_Address'].setValue('testmailinator.com');
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         //4. invalid email without .(dot) case
//         component.lnFrm.controls['Email_Address'].setValue('testmailinator.com');
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         //5. valid email case
//         component.lnFrm.controls['Email_Address'].setValue('test@mailinator.com');
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);

//     });

//     it('submit button should be disabled when email is not valid', () => {
//        //1. valid case
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
//         expect(component.lnFrm.controls['Email_Address'].hasError('required')).toBe(false);
//         //2. empty case
//         component.lnFrm.controls['Email_Address'].setValue("");
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         expect(component.lnFrm.controls['Email_Address'].hasError('required')).toBe(true);
//         //3. invalid email without @ case
//         component.lnFrm.controls['Email_Address'].setValue('testmailinator.com');
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         //4. invalid email without .(dot) case
//         component.lnFrm.controls['Email_Address'].setValue('testmailinator.com');
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         //5. valid email case
//         component.lnFrm.controls['Email_Address'].setValue('test@mailinator.com');
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);

//     });

//     it('should show an error message when email is empty', () => {
//         // empty case
//         component.lnFrm.controls['Email_Address'].setValue("");
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         expect(component.lnFrm.controls['Email_Address'].hasError('required')).toBe(true);
       
//     });

//    it('should have password defined', () => {
//         expect(component.lnFrm.controls['User_Password']).toBeDefined();
//     });
//      it('submit button should be disabled when password is empty', () => {
//         //1. valid case
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
//         expect(component.lnFrm.controls['User_Password'].hasError('required')).toBe(false);
//         //2. empty case
//         component.lnFrm.controls['User_Password'].setValue("");
//         fixture.detectChanges();
//         expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
//         expect(component.lnFrm.controls['User_Password'].hasError('required')).toBe(true);
//     });
    
// });
