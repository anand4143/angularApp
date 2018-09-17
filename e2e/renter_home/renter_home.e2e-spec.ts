import { ConcreetClientRenterHomePage } from './renter_home.po';
import { element, by, browser, protractor } from 'protractor';

describe('Concreet Client App - Renter Home Page', function () {
    let page: ConcreetClientRenterHomePage;
    let addressLine1;
    let addressLine2;
    let addressLine1ToMatch;
    let addressLine2ToMatch;
    var brokerEmailId; 

    beforeEach(() => {
        page = new ConcreetClientRenterHomePage();
        page.navigateTo().then(function () {
            page.goToLoginPage();
            // expect(page.getCurrentUrl()).toContain('user/login');
            page.getEmailId().sendKeys("ashugupta17791@gmail.com");
            page.getPassword().sendKeys("Admin@123");
            page.getLogInButton().click();
            page.browserSleep();
        });
    });

    // new user / renter logging
    describe('User Home Page ', function () {
        it('Complete flow for renter / user', function () {
            page.browserWait().then(checkHomePage);
        });
    });

    function checkHomePage(){
        expect(page.getCurrentUrl()).toContain('user/home');
        page.getAddListing().click().then(inspectBookmarkPage);
    }

    function inspectBookmarkPage(){
        expect(page.getCurrentUrl()).toContain('user/bookmark');
        //expect(page.getFindListing().isEnabled()).toBe(false);
        page.getUnit().sendKeys('A-A');
        page.getStreet().sendKeys('Manhattan').then(searchProperty);
    }

    function searchProperty(){
        page.browserSleep();
        page.getGoogleSearch().get(0).click().then(inspectSearch);
    }

    function inspectSearch(){
        page.getFindListing().click().then(checkSpinner);
    }

    function checkSpinner(){
        expect(page.getSpinner().isDisplayed());
        page.browserWait().then(checkListing);
    }

    function checkListing(){
        page.moveToPropertyList();
        page.browserSleep();
        // expect(page.getProertyListMsg().getText()).toContain('Listing Results');
        expect(page.getPropertyListTH().get(0).getText()).toContain('ADDRESS');
        expect(page.getPropertyListTH().get(1).getText()).toContain('UNIT NUM.');
        page.getPropertyList().click().then(goToPropertyDetail);
        //page.browserSleep();
    }

    function goToPropertyDetail(){
        page.scrollUp();
        page.browserSleep();
        addressLine1 = page.getAddress().get(0).getText();
        addressLine2 = page.getAddress().get(1).getText();
        expect(page.getBookmarkButton().getText()).toBe('Bookmark');
        page.getBookmarkButton().click().then(checkBookmark);
    }

    function checkBookmark(){
        page.browserWait().then(checkBookmarkPage);
    }

    function checkBookmarkPage(){
        page.browserSleep();
        // brokerEmailId = page.getBrokerEmailId().evaluate('bkmrk.getAccessInfo()');
        page.getBrokerEmailId().getText().then(setBrokerEmail)   
        console.log('brokerEmailId' , brokerEmailId);
        expect(page.getApplyButton().getText()).toBe('APPLY');
        expect(page.getAddress().get(0).getText()).toBe(addressLine1);
        expect(page.getAddress().get(1).getText()).toBe(addressLine2);
        applyBookmark();
        page.browserSleep();
    }

    function setBrokerEmail(value){
        console.log('value', value);
        brokerEmailId  = value;
        console.log('brokerEmailId', brokerEmailId);
        // return brokerEmailId;
    }

    function applyBookmark(){
        page.getApplyButton().click();
        page.browserWait().then(checkApplyPage)
    }

    function checkApplyPage(){
        page.browserSleep();
        page.getPopUpCloseButton().click();
        expect(page.getAppliedButton().getText()).toBe('APPLIED');
    }

    
    // describe('Back Button', function () {
    //     it('should go to pervious page', function () {
    //         page.getBackButton().click().then(function () {
    //             page.browserWait().then(function () {
    //                 page.getCurrentUrl().then(function (currentUrl) {
    //                     expect(currentUrl).toContain('/');
    //                 })
    //             })
    //         });
    //     });
    // });

});