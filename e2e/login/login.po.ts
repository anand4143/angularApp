import { browser, element, by } from 'protractor';

export class ConcreetClientLoginPage {
    navigateTo(){
        return browser.get('/');
    }

    goToLoginPage(){
       return element(by.linkText('LOGIN')).click();
    }

    browserWait(){
        return browser.waitForAngular();
    }

    browserSleep(){
        return browser.sleep(3000);
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

    getEmailIdError(){
        return browser.findElement(by.id('Email_Address')).findElement(by.xpath('following-sibling::div'));
     }

    getPasswordError(){
        return browser.findElement(by.id('User_Password')).findElement(by.xpath('following-sibling::div'));
    }
    
    getLogInButton(){
       return element(by.buttonText('LOG IN'));     
    }

    getLoginButton(){
        return element(by.id('login'));
    }

    getBackButton(){
        return element(by.className('backbtn'));
    }
}