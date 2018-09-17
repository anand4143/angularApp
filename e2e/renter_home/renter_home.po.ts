import { element, by, browser, protractor } from 'protractor';

export class ConcreetClientRenterHomePage {
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

    getEmailId() {
        return browser.findElement(by.id('Email_Address'));
    }

    getPassword() {
        return browser.findElement(by.id('User_Password'));
    }

    getLogInButton() {
        return element(by.buttonText('LOG IN'));
    }

    // getBookMark() {
    //     return element.all(by.css('.bookmark-list a'));
    // }

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
        // return browser.findElement(by.id('listing-results')).findElement(by.xpath('following-sibling::p'));
        //    return browser.findElement(by.id('listing-results'));   
        return browser.findElement(by.id('pList'));

    }

    getPropertyListTH() {
        return element.all(by.tagName('th'));
    }

    getPropertyList() {
        return element(by.tagName('td'));
    }

    getApplyButton() {
        // return browser.findElement(by.id('aplbtn1'));
         return browser.findElement(by.id('aplbtn1'));
    }

     getAppliedButton() {
        // return browser.findElement(by.id('aplbtn1'));
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
        // return browser.findElement(by.className('pac-container'));
        // return element.all(by.className('pac-container'));
        return element.all(by.className('pac-item'));
    }

    getSpinner() {
        return browser.findElement(by.css('.spinner'));
    }

    getAddress(){       
          return element.all(by.tagName('h1'));
    }

    getPopUpCloseButton(){
        return browser.findElement(by.buttonText('Close'));
    }

    getBrokerEmailId(){
        return  element(by.id('brokerEmailId'));
    }


}