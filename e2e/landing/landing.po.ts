import { browser, element, by } from 'protractor';

export class ConcreetClientLandingPage {
  navigateTo() {
    return browser.get('/');
  }

   getCurrentUrl(){
    return browser.getCurrentUrl();
  }

  getMessageElements(){
    return element.all(by.css('app-root h5'));
  }

  getRegisterButton(){
      return element(by.linkText('REGISTER'));
      // element(by.className('error'));
  }

  getLoginButton(){
     return element(by.linkText('LOGIN'));  
  }

  getLandlordButton(){
    return element(by.linkText('LANDLORD LOGIN'));  
  }

  getBrokerButton(){
    return element(by.linkText('BROKER LOGIN'));   
  }

 
}
