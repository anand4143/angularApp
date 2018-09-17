import { ConcreetClientBrokerPage } from './broker.po';

describe('concreet-client App - Broker Page', function () {
    let page: ConcreetClientBrokerPage;

    beforeEach(() => {
        page = new ConcreetClientBrokerPage();
        page.navigateTo().then(function () {
            page.goToBrokerLoginPage();
        });
    });

    describe('Broker Panel', function () {
        it('Complete flow for broker panel', function () {
            // expect(page.getCurrentUrl()).toContain('login/4');
            page.getEmailId().sendKeys("cgoldstein@halstead.com");
            page.getPassword().sendKeys("Abc@123");
            page.scrollDown();
            page.browserSleep();
            page.getLogInButton().click().then(checkBrokerHome);
        });
    });

    function checkBrokerHome() {
        page.browserWait().then(function () {
            page.browserSleep();
            expect(page.getCurrentUrl()).toContain('broker/home');
            page.browserWait().then(checkApplicationInLandlord);
        })
    }

    function checkApplicationInLandlord() {
        page.getApplicationFromBroker().click();
        page.browserSleep();
        page.browserWait().then(checkAccept);
    }

    function checkAccept() {
        page.browserSleep();
        page.getAcceptButton().click();
        page.browserSleep();
        page.browserWait().then(checkBrokerInfoBox);
    }

    function checkBrokerInfoBox() {
        for (var i = 0; i <= 11; i++) {
            page.getBrokerInfoBoxes().get(i).click();
            page.browserWait().then(checkCompleteButton);
            console.log('i', i)      
        }
        page.browserSleep();
        page.browserWait().then(checkAddLandlord);
    }

    function checkCompleteButton() {
        page.browserSleep();
        page.getCompleteButton().click();
        page.browserSleep();
        // page.browserWait().then(closePopUp);
    }

    function checkAddLandlord() {
        page.browserSleep();
        page.getAddLandlordButton().click();
        page.browserSleep();
        page.browserWait().then(addLandLordData);
    }

    function addLandLordData() {
        page.browserSleep();
        page.getLandlordFirstName().sendKeys('EtoTest1');
        page.getLandlordLastName().sendKeys('User1');
        page.getLandlordEmail().sendKeys('landlordtest2@mailinator.com');
        page.getLandlordConfEmail().sendKeys('landlordtest2@mailinator.com');
        page.browserSleep();
        page.browserWait().then(addLandlord);
    }

    function addLandlord() {
        page.browserSleep();
        page.getSendLandLordPkgButton().click();
        page.browserSleep();
    }


    // describe('Back Button', function () {
    //     it('should go to pervious page', function () {
    //         page.moveToLoginButton();
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
