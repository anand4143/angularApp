import { ConcreetClientLandlordPage } from './landlord.po';

describe('concreet-client App - Landlord Page', function () {
    let page: ConcreetClientLandlordPage;

    beforeEach(() => {
        page = new ConcreetClientLandlordPage();
        page.navigateTo().then(function () {
            page.goToLandlordLoginPage();
        });
    });

    describe('Landlord Panel', function () {
        it('Complete flow for landlord', function () {
            expect(page.getCurrentUrl()).toContain('login/4');
            page.getEmailId().sendKeys("landlordtest1@mailinator.com");
            page.getPassword().sendKeys("Abc@123");
            page.moveToLoginButton();
            page.browserSleep();
            page.getLogInButton().click().then(checkLandlordHome);
        });
    });

    function checkLandlordHome() {
        page.browserWait().then(function () {
            page.browserSleep();
            expect(page.getCurrentUrl()).toContain('landlord/home');
            page.browserWait().then(checkApplicationInLandlord);
        })
    }

    function checkApplicationInLandlord() {
        page.getApplication().click();
        page.browserSleep();
        page.browserWait().then(checkLandlordInfoBox);
    }

    function checkLandlordInfoBox() {
        for (var i = 0; i <= 11; i++) {
            page.getInfoBoxes().get(i).click();
            page.getCloseButton().click();
            page.browserSleep();
            console.log('i', i)
        }
    }


    //    describe('Back Button', function(){     
    //         it('should go to pervious page' , function(){
    //             page.moveToLoginButton();
    //             page.getBackButton().click().then(function(){
    //             page.browserWait().then(function(){
    //                 page.getCurrentUrl().then(function(currentUrl){
    //                     expect(currentUrl).toContain('/');
    //                 })
    //              })
    //             });       
    //         });
    //      });
});
