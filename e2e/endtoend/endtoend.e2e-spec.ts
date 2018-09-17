import { ConcreetClientEndToEnd } from './endtoend.po';
import { element, by, browser, protractor } from 'protractor';

describe('Concreet Client App - Renter Home Page', function () {
    let page: ConcreetClientEndToEnd;
    let addressLine1;
    let addressLine2;
    let addressLine1ToMatch;
    let addressLine2ToMatch;
    var brokerEmailId;
    var brokerData;

    beforeEach(() => {
        page = new ConcreetClientEndToEnd();
        page.navigateTo().then(function () {
            page.goToLoginPage();
            // expect(page.getCurrentUrl()).toContain('user/login');
            page.getRenterEmailId().sendKeys("ashu17gupta7@gmail.com");
            page.getRenterPassword().sendKeys("Admin@123");
            page.getRenterLogInButton().click();
            page.browserSleep();
        });
    });

    describe('End to end flow : ', function () {
        it('Complete flow from renter to landlord', function () {
            page.browserWait().then(checkHomePage);
        });
    });

    // renter
    function checkHomePage() {
        page.browserSleep();
        page.browserWait();
        expect(page.getCurrentUrl()).toContain('user/home');
        page.getAddListing().click().then(inspectBookmarkPage);
    }

    function inspectBookmarkPage() {
        page.browserSleep();
        expect(page.getCurrentUrl()).toContain('user/bookmark');
        //expect(page.getFindListing().isEnabled()).toBe(false);
        page.getUnit().sendKeys('3-F');
        page.getStreet().sendKeys('Manhattan');
        page.browserSleep();
        page.browserWait().then(searchProperty);
    }

    function searchProperty() {
        page.browserSleep();
        page.getGoogleSearch().get(0).click().then(inspectSearch);
    }

    function inspectSearch() {
        page.browserSleep();
        page.getFindListing().click().then(checkSpinner);
    }

    function checkSpinner() {
        expect(page.getSpinner().isDisplayed());
        page.browserWait().then(checkListing);
    }

    function checkListing() {
        page.moveToPropertyList();
        page.browserSleep();
        // expect(page.getProertyListMsg().getText()).toContain('Listing Results');
        expect(page.getPropertyListTH().get(0).getText()).toContain('ADDRESS');
        expect(page.getPropertyListTH().get(1).getText()).toContain('UNIT NUM.');
        page.getPropertyList().click().then(goToPropertyDetail);
        //page.browserSleep();
    }

    function goToPropertyDetail() {
        page.scrollUp();
        page.browserSleep();
        addressLine1 = page.getAddress().get(0).getText();
        addressLine2 = page.getAddress().get(1).getText();
        expect(page.getBookmarkButton().getText()).toBe('Bookmark');
        page.getBookmarkButton().click().then(checkBookmark);
    }

    function checkBookmark() {
        page.browserWait().then(checkBookmarkPage);
    }

    function checkBookmarkPage() {
        page.browserSleep();
        // brokerEmailId = page.getBrokerEmailId().evaluate('bkmrk.getAccessInfo()');
        page.getBrokerEmailIdFromRenter().getText().then(setBrokerEmailId)
        console.log('brokerEmailId - 1 ', brokerEmailId);
        expect(page.getApplyButton().getText()).toBe('APPLY');
        expect(page.getAddress().get(0).getText()).toBe(addressLine1);
        expect(page.getAddress().get(1).getText()).toBe(addressLine2);
        applyBookmark();
        page.browserSleep();
    }

    function setBrokerEmailId(value) {
        console.log('value', value);
        brokerData = value;
        console.log('brokerData', brokerData);
        brokerData = brokerData.split(" ");
        for (var i = 0; i <= brokerData.length; i++) {
            brokerEmailId = brokerData[2];
        }
        console.log('brokerEmailId', brokerEmailId);
    }

    function applyBookmark() {
        page.getApplyButton().click();
        page.browserWait().then(checkApplyPage)
    }

    function checkApplyPage() {
        page.browserSleep();
        page.getPopUpCloseButton().click();
        expect(page.getAppliedButton().getText()).toBe('APPLIED');
        page.browserWait().then(checkRenterDropDown);
    }

    function checkRenterDropDown() {
        page.getDropDown().click();
        page.browserSleep();
        page.browserWait().then(renterLogOut);

    }

    function renterLogOut() {
        page.getLogOut().click();
        page.browserSleep();
        goToBrokerPage();

    }

    //broker 
    function goToBrokerPage() {
        page.navigateTo();
        page.browserWait().then(checkBrokerPage);
    }

    function checkBrokerPage() {
        page.getBrokerButton().click().then(function () {
            page.getCurrentUrl().then(function (currentUrl) {
                // expect(currentUrl).toContain('login/2');
                page.browserWait().then(brokerLogin);
            })
        });
    }

    function brokerLogin() {
        // page.getBrokerEmailId().sendKeys('cgoldstein@halstead.com');
        page.getBrokerEmailId().sendKeys("RLEAL@CITIHABITATS.COM");
        page.getBrokerPassword().sendKeys("Abc@123");
        page.moveToLoginButton();
        page.browserSleep();
        page.getBrokerLogInButton().click();
        page.browserSleep();
        page.browserWait().then(checkBrokerHome);

    }

    function checkBrokerHome() {
        page.browserWait().then(function () {
            page.browserSleep();
            // expect(page.getCurrentUrl()).toContain('broker/home');
            page.browserWait().then(checkApplicationInLandlord);
        })
    }

    function checkApplicationInLandlord() {
        page.browserSleep();
        page.getApplication().click();
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
            page.browserSleep();
            page.getInfoBoxes().get(i).click();
            page.browserSleep();
            page.browserWait().then(checkCompleteButton);
            console.log('i', i)
        }

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
        // page.scrollUp();
        page.browserWait().then(function () {
            page.getAddLandlordButton().click();
            page.browserSleep();
            page.browserWait().then(addLandLordData);
        })
    }

    function addLandLordData() {
        page.browserSleep();
        page.browserWait();
        page.getLandlordFirstName().sendKeys('EtoTest3');
        page.getLandlordLastName().sendKeys('User3');
        page.getLandlordEmail().sendKeys('landlordtest3@mailinator.com');
        page.getLandlordConfEmail().sendKeys('landlordtest3@mailinator.com');
        page.browserSleep();
        page.browserWait().then(addLandlord);
    }

    function addLandlord() {
        page.browserSleep();
        page.getSendLandLordPkgButton().click();
        page.browserSleep();
        page.browserWait().then(checkBrokerDropDown);
    }

    function checkBrokerDropDown() {
        page.getDropDown().click();
        page.browserSleep();
        page.browserWait().then(brokerLogOut);
    }

    function brokerLogOut() {
        page.getLogOut().click();
        page.browserSleep();
        goToLandlordPage();
    }

    // landlord
    function goToLandlordPage() {
        page.navigateTo();
        page.browserWait().then(checkLandlordPage);
    }

    function checkLandlordPage() {
        page.goToLandlordLoginPage();
        page.browserSleep();
        expect(page.getCurrentUrl()).toContain('login/4');
        page.getLandlordEmailId().sendKeys("landlordtest2@mailinator.com");
        page.getLandlordPassword().sendKeys("Abc@123");
        page.moveToLoginButton();
        page.browserSleep();
        page.getLandlordLogInButton().click().then(checkLandlordHome);
    }

    function checkLandlordHome() {
        page.browserWait().then(function () {
            page.browserSleep();
            expect(page.getCurrentUrl()).toContain('landlord/home');
            page.browserWait().then(checkApplicationLandlord);
        })
    }

    function checkApplicationLandlord() {
        page.browserSleep();
        page.browserWait();
        page.getApplication().click();
        page.browserSleep();
        page.browserWait().then(checkLandlordInfoBox);
    }

    function checkLandlordInfoBox() {
        page.browserSleep();
        for (var i = 0; i <= 11; i++) {
            page.getInfoBoxes().get(i).click();
            page.getCloseButton().click();
            page.browserSleep();
            console.log('i', i)
        }
        page.browserSleep();
        page.browserWait().then(checkLandlordDropDown);
    }

    function checkLandlordDropDown() {
        page.getDropDown().click();
        page.browserSleep();
        page.browserWait().then(landlordLogOut);
        // page.navigateTo();
    }

    function landlordLogOut() {
        page.getLogOut().click();
        page.browserSleep();
    }


});