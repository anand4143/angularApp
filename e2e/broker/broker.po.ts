import { browser, element, by } from 'protractor';

export class ConcreetClientBrokerPage {
  navigateTo() {
    return browser.get('/');
  }

  goToBrokerLoginPage() {
    return element(by.linkText('BROKER LOGIN')).click();
  }

  browserWait() {
    return browser.waitForAngular();
  }

  browserSleep() {
    return browser.sleep(9000);
  }

  getCurrentUrl() {
    return browser.getCurrentUrl();
  }

  getEmailId() {
    return browser.findElement(by.id('Email_Address'));
  }

  getPassword() {
    return browser.findElement(by.id('User_Password'));
  }

  scrollDown() {
    //return browser.actions().mouseMove(element(by.buttonText('LOG IN'))).perform();
    return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
  }

  getLogInButton() {
    return element(by.buttonText('LOG IN'));
  }

  getBackButton() {
    return element(by.className('backbtn'));
  }

  getApplicationFromBroker() {
    return browser.element(by.tagName('tr'));
  }

  getBrokerInfoBoxes() {
     return browser.element.all(by.className('info-box'));
  }

  getCloseButton() {
    return browser.element(by.className('fa fa-times fa-lg'));
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

  getSendLandLordPkgButton(){
     return browser.findElement(by.id('sendLandlordDataButton'));
  }


}
