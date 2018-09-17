import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';


@Directive({
    selector: '[validateEmail][formControlName],[validateEmail][formControl],[validateEmail][ngModel]',
    providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidator), multi: true }]
})
export class EmailValidator implements Validator{
    
    validate(control: AbstractControl): ValidationResult {
        var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (control.value && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { validateEmail: false };
        } else {
            if (control.errors) delete control.errors['validateEmail'];
            if (control.errors && !Object.keys(control.errors).length) control.setErrors(null);
        }

        return null;
    }

}

@Directive({
    selector: '[validatePhone][formControlName],[validatePhone][formControl],[validatePhone][ngModel]',
    providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => PhoneValidator), multi: true }]
})
export class PhoneValidator implements Validator{
    
    validate(control: AbstractControl): ValidationResult {
        var PHONE_REGEXP = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

        if (control.value && (control.value.length != 12 || !PHONE_REGEXP.test(control.value))) {
            return { validatePhone: false };
        } else {
            if (control.errors) delete control.errors['validatePhone'];
            if (control.errors && !Object.keys(control.errors).length) control.setErrors(null);
        }

        return null;
    }

}

@Directive({
    selector: '[validatePassword][formControlName],[validatePassword][formControl],[validatePassword][ngModel]',
    providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordValidator), multi: true }]
})
export class PasswordValidator implements Validator{
    
    // Password must be atleast 7 characters long with atleast 1 Lower case, 1 Upper Case and a Numeral
    validate(control: AbstractControl): ValidationResult {
        //var PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])[A-Za-z\d$@$!%*?&]{7,}$/;
        var PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,}$/;
        if (control.value && (control.value.length <= 7 || !PASSWORD_REGEXP.test(control.value))) {
            return { validatePassword: false };
        } else {
            if (control.errors) delete control.errors['validatePassword'];
            if (control.errors && !Object.keys(control.errors).length) control.setErrors(null);
        }

        return null;
    }

}

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})

export class EqualValidator implements Validator {
    constructor(@Attribute('validateEqual') public validateEqual: string,
    @Attribute('reverse') public reverse: string) {
    }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true: false;
    }

    validate(c: AbstractControl): ValidationResult {
        // self value
        let v = c.value;

        // control vlaue
        let e = c.root.get(this.validateEqual);

        // value not equal
        if (e && v !== e.value && !this.isReverse) {
            return {
                validateEqual: false
            }
        }

        // value equal and reverse
        if (e && v === e.value && this.isReverse) {
            delete e.errors['validateEqual'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }

        // value not equal and reverse
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({ validateEqual: false });
        }

        return null;
    }
}

interface ValidationResult {
    [key: string]: boolean;
}