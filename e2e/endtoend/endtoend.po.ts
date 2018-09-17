import { element, by, browser, protractor } from 'protractor';

export class ConcreetClientEndToEnd {
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

    moveToPropertyList() {
        return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
    }

    scrollUp() {
        return browser.executeScript('window.scrollTo(0,0);');
    }

    getCurrentUrl() {
        return browser.getCurrentUrl();
    }

    goToLoginPage() {
        return element(by.linkText('LOGIN')).click();
    }

    getRenterEmailId() {
        return browser.findElement(by.id('Email_Address'));
    }

    getRenterPassword() {
        return browser.findElement(by.id('User_Password'));
    }

    getRenterLogInButton() {
        return element(by.buttonText('LOG IN'));
    }

    getAddListing() {
        return browser.findElement(by.id('addList'));
    }

    getStreet() {
        return browser.findElement(by.id('search-box'));
    }

    getCity() {
        return browser.findElement(by.name('city'));
    }

    getUnit() {
        return browser.findElement(by.name('unit'));
    }

    getState() {
        return browser.findElement(by.name('state'));
    }

    getZip() {
        return browser.findElement(by.name('zip'));
    }

    getFindListing() {
        return browser.findElement(by.buttonText('Find Listings'));
    }

    getProertyListMsg() {
        return browser.findElement(by.id('pList'));
    }

    getPropertyListTH() {
        return element.all(by.tagName('th'));
    }

    getPropertyList() {
        return element(by.tagName('td'));
    }

    getApplyButton() {
        return browser.findElement(by.id('aplbtn1'));
    }

    getAppliedButton() {
        return browser.findElement(by.id('appliedButton'));
    }

    getViewApplication() {
        return browser.findElement(by.id('aplbtn2'));
    }

    getBookmarkButton() {
        return browser.findElement(by.id('aplbtn3'));
    }

    getBackButton() {
        return browser.findElement(by.className('col-xs-3 backbtn'));
    }

    getGoogleSearch() {
        return element.all(by.className('pac-item'));
    }

    getSpinner() {
        return browser.findElement(by.css('.spinner'));
    }

    getAddress() {
        return element.all(by.tagName('h1'));
    }

    getPopUpCloseButton() {
        return browser.findElement(by.buttonText('Close'));
    }

    getDropDown() {
        return browser.findElement(by.className('welcome-home'));
    }

    getLogOut() {
        return browser.findElement(by.id('userLogOut'));
    }

    getBrokerButton() {
        return element(by.linkText('BROKER LOGIN'));
    }

    getBrokerEmailIdFromRenter() {
        return element(by.id('brokerEmailId'));
    }

    getBrokerEmailId() {
        return browser.findElement(by.id('Email_Address'));
    }

    getBrokerPassword() {
        return browser.findElement(by.id('User_Password'));
    }

    moveToLoginButton() {
        return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
    }

    getBrokerLogInButton() {
        return element(by.buttonText('LOG IN'));
    }

    // getApplicationFromBroker() {
    //     return browser.element(by.tagName('tr'));
    // }

    getInfoBoxes() {
        return browser.element.all(by.className('info-box'));
    }

    getCloseButton() {
        return browser.element(by.className('fa fa-times fa-lg'));
    }

    getBrokerInfoBoxes() {
        return browser.element.all(by.className('info-box'));
    }

    getAcceptButton() {
        return browser.element(by.buttonText('Accept'));
    }

    getCompleteButton() {
        return browser.element(by.buttonText('Complete'));
    }

    getAddLandlordButton() {
        return browser.element(by.id('addLandlordButton'));
    }

    getLandlordFirstName() {
        return browser.findElement(by.id('landlordFirstName'));
    }

    getLandlordLastName() {
        return browser.findElement(by.id('landlordLastName'));
    }

    getLandlordEmail() {
        return browser.findElement(by.id('landlordEmail'));
    }

    getLandlordConfEmail() {
        return browser.findElement(by.id('landlordConfEmail'));
    }

    getSendLandLordPkgButton() {
        return browser.findElement(by.id('sendLandlordDataButton'));
    }

    getLandlordEmailId() {
        return browser.findElement(by.id('Email_Address'));
    }

    getLandlordPassword() {
        return browser.findElement(by.id('User_Password'));
    }

    getLandlordLogInButton() {
        return element(by.buttonText('LOG IN'));
    }

    goToLandlordLoginPage() {
        return element(by.linkText('LANDLORD LOGIN')).click();
    }

    
    getApplication(){
      return browser.element(by.tagName('tr'));
    }


}