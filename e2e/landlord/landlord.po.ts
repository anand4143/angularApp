import { browser, element, by } from 'protractor';

export class ConcreetClientLandlordPage {
    navigateTo() {
      return browser.get('/');
    }

    goToLandlordLoginPage(){
       return element(by.linkText('LANDLORD LOGIN')).click();
    }

    browserWait(){
      return browser.waitForAngular();
    }

   browserSleep(){
      return browser.sleep(9000);
    }

   getCurrentUrl(){
    return browser.getCurrentUrl();
   }

   getEmailId(){  
        return browser.findElement(by.id('Email_Address'));
    }
 
    getPassword(){
      return browser.findElement(by.id('User_Password'));
    }

    moveToLoginButton(){
      //return browser.actions().mouseMove(element(by.buttonText('LOG IN'))).perform();
      return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
    }

    getLogInButton(){
       return element(by.buttonText('LOG IN'));     
    }

     getBackButton(){
        return element(by.className('backbtn'));
    }

    getApplication(){
      return browser.element(by.tagName('tr'));
    }

    getInfoBoxes(){
      return browser.element.all(by.className('info-box'));
    }

    getCloseButton(){
      return browser.element(by.className('fa fa-times fa-lg'));
    }

}
