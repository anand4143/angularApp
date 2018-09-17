import { ConcreetClientLandingPage } from './landing.po';

describe('concreet-client App - Landing Page', function() {
  let page: ConcreetClientLandingPage;

    beforeEach(() => {
      page = new ConcreetClientLandingPage();
      page.navigateTo();
    });

    describe('User Interface', function() {
      it('should contain a message READY TO RENT?', () => {
        expect(page.getMessageElements().get(0).getText()).toEqual('READY TO RENT?');
      });
      it("should contain a message IT'S EASY AS 1-2-3", () => {
        expect(page.getMessageElements().get(1).getText()).toEqual("IT'S EASY AS 1-2-3.");
      });
      it("should contain a message 1. REGISTER", () => {
        expect(page.getMessageElements().get(3).getText()).toEqual("1. REGISTER");
      });
      it("should contain a message 2. APPLY", () => {
        expect(page.getMessageElements().get(4).getText()).toEqual("2. APPLY");
      });
      it("should contain a message 3. PAY RENT", () => {
        expect(page.getMessageElements().get(5).getText()).toEqual("3. PAY RENT");
      });
    });

    describe('Register Button', function() {
      it("should take the user to Register Page", function() {    
          page.getRegisterButton().click().then(function(){
            page.getCurrentUrl().then(function(currentUrl){
              expect(currentUrl).toContain('user/register-new');
            })
          });
      });
    });

    describe('Login Button', function() {
      it("should take the user to Login Page", function(){    
           page.getLoginButton().click().then(function(){
            page.getCurrentUrl().then(function(currentUrl){
              expect(currentUrl).toContain('login/1');
            })
          });
      });
    });

   describe('Landlord Button', function() {
      it("should take the user to Landlord Login Page", function(){    
           page.getLandlordButton().click().then(function(){
            page.getCurrentUrl().then(function(currentUrl){
              expect(currentUrl).toContain('login/4');
            })
          });
      });
    });

   describe('Broker Button', function() {
      it("should take the user to Broker Login Page", function(){    
           page.getBrokerButton().click().then(function(){
            page.getCurrentUrl().then(function(currentUrl){
              expect(currentUrl).toContain('login/2');
            })
          });
      });
    });
});
