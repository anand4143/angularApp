/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegisterUserComponent } from './register-user.component';
require('../app.unittest.spec');

describe('RegisterUserComponent', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;
  let compiled: any;


  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
        component.rgMdl = {
            "User_First_Name":"vijay",
            "User_Last_Name":"Raja",
            "Email.Email_Address":"df@gffg.com",
            "User_Password":"Admin@12",
            "confirmpassword":"Admin@12",
            "Contact.Contact_Num":"1234567890",
        };

        component.rgFrm.controls['captcha'].setValue(true);
        fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 /** first name test cases */
    it('should have first name defined', () => {
        expect(component.rgFrm.controls['User_First_Name']).toBeDefined();
    });

    it('first name should be atleast 2 character long ', () => {
        //1. valid case
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
        //2. empty case
        component.rgFrm.controls['User_First_Name'].setValue("");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        //3. single character case
        component.rgFrm.controls['User_First_Name'].setValue("v");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        //4. more than 32 characters case
        component.rgFrm.controls['User_First_Name'].setValue("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        //5. less than 32 characters case
        component.rgFrm.controls['User_First_Name'].setValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
        //6. boderline valid case
        component.rgFrm.controls['User_First_Name'].setValue("vi");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
    });
    it('first name should not be 32 character long ', () => {
        //1. valid case
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
        //2. empty case
        component.rgFrm.controls['User_First_Name'].setValue("");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        //3. single character case
        component.rgFrm.controls['User_First_Name'].setValue("v");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        //4. more than 32 characters case
        component.rgFrm.controls['User_First_Name'].setValue("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        //5. less than 32 characters case
        component.rgFrm.controls['User_First_Name'].setValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
        //6. boderline valid case
        component.rgFrm.controls['User_First_Name'].setValue("vi");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
    });

    it('submit button shoult be disable when first name is empty/less than 2 characters.', () => {
        //1. valid case
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        //2. empty case
        component.rgFrm.controls['User_First_Name'].setValue("");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //3. single character case
        component.rgFrm.controls['User_First_Name'].setValue("v");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //4. boderline valid case
        component.rgFrm.controls['User_First_Name'].setValue("vi");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
    });

    it('should show proper error messages when first name is empty/less than 2 characters.', () => {
        //1.  valid case
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
        expect(component.rgFrm.controls['User_First_Name'].hasError('minlength')).toBe(false);
        expect(component.rgFrm.controls['User_First_Name'].hasError('required')).toBe(false);
        //2. single character
        component.rgFrm.controls['User_First_Name'].setValue("v");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        expect(component.rgFrm.controls['User_First_Name'].hasError('minlength')).toBe(true);
        expect(component.rgFrm.controls['User_First_Name'].hasError('required')).toBe(false);
        //3. empty value
        component.rgFrm.controls['User_First_Name'].setValue("");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(false);
        expect(component.rgFrm.controls['User_First_Name'].hasError('minlength')).toBe(false);
        expect(component.rgFrm.controls['User_First_Name'].hasError('required')).toBe(true);
        //4. boderline valid case
        component.rgFrm.controls['User_First_Name'].setValue("vi");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_First_Name'].valid).toBe(true);
        expect(component.rgFrm.controls['User_First_Name'].hasError('minlength')).toBe(false);
        expect(component.rgFrm.controls['User_First_Name'].hasError('required')).toBe(false);
    });

    /* Last name feild cases */

    it('should have last name defined', () => {
        expect(component.rgFrm.controls['User_Last_Name']).toBeDefined();
    });

    it('last name should be atleast 2 character long', () => {
        //1. valid case
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(true);
        //2. empty case
        component.rgFrm.controls['User_Last_Name'].setValue("");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(false);
        //3. single character case
        component.rgFrm.controls['User_Last_Name'].setValue("v");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(false);
        //4. boderline valid case
        component.rgFrm.controls['User_Last_Name'].setValue("vi");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(true);
    });

    it('submit button should be disabled when last name is empty/less than 2 characters.', () => {
        //1. valid case
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        //2. empty case
        component.rgFrm.controls['User_Last_Name'].setValue("");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //3. single character case
        component.rgFrm.controls['User_Last_Name'].setValue("v");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //4. boderline valid case
        component.rgFrm.controls['User_Last_Name'].setValue("vi");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
    });
    it('should show an error message when last name is empty/less than 2 characters.', () => {
        //1.  valid case
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(true);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('minlength')).toBe(false);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('required')).toBe(false);
        //2. single character
        component.rgFrm.controls['User_Last_Name'].setValue("v");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(false);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('minlength')).toBe(true);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('required')).toBe(false);
        //3. empty value
        component.rgFrm.controls['User_Last_Name'].setValue("");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(false);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('minlength')).toBe(false);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('required')).toBe(true);
        //4. boderline valid case
        component.rgFrm.controls['User_Last_Name'].setValue("vi");
        fixture.detectChanges();
        expect(component.rgFrm.controls['User_Last_Name'].valid).toBe(true);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('minlength')).toBe(false);
        expect(component.rgFrm.controls['User_Last_Name'].hasError('required')).toBe(false);
    });

    /* Email feild test cases */

    it('should have email defined', () => {
        expect(component.rgFrm.controls['Email.Email_Address']).toBeDefined();
    });
    
    it('submit button should be disabled when email is empty', () => {
        //1. valid case
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);
        //2. empty case
        component.rgFrm.controls['Email.Email_Address'].setValue("");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(true);
        //3. invalid email without @ case
        component.rgFrm.controls['Email.Email_Address'].setValue('testmailinator.com');
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);
        //4. invalid email without .(dot) case
        // component.rgFrm.controls['Email.Email_Address'].setValue('testmailinator@sjdfsldf');
        // fixture.detectChanges();
        // expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        // expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);
        //5. valid email case
        // component.rgFrm.controls['Email.Email_Address'].setValue('test@mailinator.com');
        // fixture.detectChanges();
        // expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        // expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);


    });

    it('submit button should be disabled when email is not valid', () => {
       //1. valid case
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);
        //2. empty case
        component.rgFrm.controls['Email.Email_Address'].setValue("");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBeTruthy();
        //3. invalid email without @ case
        component.rgFrm.controls['Email.Email_Address'].setValue('testmailinator.com');
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBeTruthy();
        //4. invalid email without .(dot) case
        component.rgFrm.controls['Email.Email_Address'].setValue('testmailinator.com');
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
       // expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(true);
        //5. valid email case
        // component.rgFrm.controls['Email.Email_Address'].setValue('test@mailinator.com');
        // fixture.detectChanges();
        // expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        // expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);

    });

    it('should show an error message when email is empty', () => {
        //1. valid case
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);
        //2. empty case
        component.rgFrm.controls['Email.Email_Address'].setValue("");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(true);
        //3. invalid email without @ case
        component.rgFrm.controls['Email.Email_Address'].setValue('testmailinator.com');
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(true);
        //4. invalid email without .(dot) case
        component.rgFrm.controls['Email.Email_Address'].setValue('testmailinator.com');
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
        //expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(true);
        //5. not empty/valid email case
        // component.rgFrm.controls['Email.Email_Address'].setValue('test@mailinator.com');
        // fixture.detectChanges();
        // expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        // expect(component.rgFrm.controls['Email.Email_Address'].hasError('required')).toBe(false);
    });

    /* Phone nubmer test cases */
    it('should have phone number defined', () => {
        expect(component.rgFrm.controls['Contact.Contact_Num']).toBeDefined();
    });
    it('should show an error message when phone number is empty', () => {
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);
        component.rgFrm.controls['Contact.Contact_Num'].setValue("");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true); 
        component.rgFrm.controls['Contact.Contact_Num'].setValue("1234567890");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(false);      
    });
    it('phone number should be valid format eg xxx xxx xxxx', () => {
        component.rgFrm.controls['Contact.Contact_Num'].setValue("stringvalue");
        fixture.detectChanges();
        expect(compiled.querySelector('button[type="submit"]').disabled).toBe(true);
    });

});
