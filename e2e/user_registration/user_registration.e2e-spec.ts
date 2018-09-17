import { ConcreetClientUserRegistration } from './user_registration.po';
import { element, by, browser, protractor } from 'protractor';

describe('Concreet Client App - Renter User Registration Page', function () {
    let page: ConcreetClientUserRegistration;
    let addressLine1;
    let addressLine2;
    let addressLine1ToMatch;
    let addressLine2ToMatch;

    beforeEach(() => {
        page = new ConcreetClientUserRegistration();
        page.navigateTo().then(function () {
            page.goToLoginPage();
            page.getEmailId().sendKeys("ashugupta17791@gmail.com");
            page.getPassword().sendKeys("Admin@123");
            page.getLogInButton().click();
            page.browserSleep();
        });
    });

    describe('should take the user to user registration page ', function () {
        it("user registration", function () {
            expect(page.getUserWelcomeMsg().getText()).toContain('WELCOME HOME, GUPTA, ASHU');
            page.getDropDown().click().then(function () {
                page.browserWait().then(function () {
                    page.browserSleep();
                    page.getUserInfoPage().click().then(function () {
                        page.browserSleep();
                        page.getCurrentUrl().then(function (currentUrl) {
                            expect(currentUrl).toContain('user/usersummary');
                            expect(page.getUserSummaryMsg().getText()).toContain('CLICK ON THE INFORMATION OR ICONS BELOW TO UPDATE YOUR INFORMATION.');
                            page.getUserProgressBarElements().get(0).click();
                            page.browserSleep();
                        })
                    })
                });
            });
        });
    });
});