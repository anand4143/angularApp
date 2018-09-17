import { element, by, browser, protractor } from 'protractor';

export class ConcreetClientUserRegistration {
    navigateTo() {
        return browser.get('/');
    }

    browserWait() {
        return browser.waitForAngular();
    }

    browserSleepShort() {
        return browser.sleep(2000);
    }

    browserSleep() {
        return browser.sleep(5000);
    }

    browserSleepLong() {
        return browser.sleep(10000);
    }


    getCurrentUrl() {
        return browser.getCurrentUrl();
    }

    goToLoginPage() {
        return element(by.linkText('LOGIN')).click();
    }

    getEmailId() {
        return browser.findElement(by.id('Email_Address'));
    }

    getPassword() {
        return browser.findElement(by.id('User_Password'));
    }

    getLogInButton() {
        return element(by.buttonText('LOG IN'));
    }

    getDropDown() {
        return browser.findElement(by.className('welcome-home'));
    }

    getUserInfoPage() {
        return browser.findElement(by.id('userInfo'));
    }

    getPaymentInfo() {
        return browser.findElement(by.id('paymentInfo'));
    }

    getUserLogOut() {
        return browser.findElement(by.id('userLogOut'));
    }

    getUserWelcomeMsg() {
        return browser.findElement(by.className('welcome-home'));
    }

    getUserSummaryMsg() {
        return browser.findElement(by.tagName('h5'));

    }

    getUserProgressBarElements() {
        return element.all(by.className('icon text'));
    }

    getUserSummaryFirstName() {
        return browser.findElement(by.id('User_First_Name'));
    }

    getUserSummaryLastName() {
        return browser.findElement(by.id('User_First_Name'));
    }

    getUserSummaryEmailId() {
        return browser.findElement(by.id('Email.Email_Address'));
    }

    getUserSummaryPhoneNumber() {
        return browser.findElement(by.id('Contact.Contact_Num'));
    }

    getChnagePwdLink() {
        return browser.findElement(by.tagName('u'));
    }

    getBackButton() {
        return element(by.className('backbtn'));
    }

    getNextButton() {
        return browser.findElement(by.buttonText('NEXT'));
    }

    getUserAddress() {
        return browser.findElement(by.id('Address_1'));
    }

    getUserSSN() {
        return browser.findElement(by.id('User_SSN'));
    }

    getUserBirthDay() {
        // need to create id
        return browser.findElement(by.id('user_bday'));
    }
}