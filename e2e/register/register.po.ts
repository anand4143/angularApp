import { element, by, browser } from  'protractor';

export class ConcreetClientRegisterPage {
    navigateTo() {
        return browser.get('/');
    }

    goToRegisterPage(){
        return element(by.linkText('REGISTER')).click();
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

   getFirstName(){  
        return browser.findElement(by.id('User_First_Name'));
    }

   getLastName(){  
        return browser.findElement(by.id('User_First_Name'));
    }

   getEmailId(){  
        return browser.findElement(by.id('Email.Email_Address'));
    }

   getPhoneNumber(){  
        return browser.findElement(by.id('Contact.Contact_Num'));
    }

   getPassword(){
      return browser.findElement(by.id('User_Password'));
    }

  getConfPassword(){
      return browser.findElement(by.id('User_Password'));
    }

}