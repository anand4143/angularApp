import { ConcreetClientLoginPage } from './login.po';

describe('concreet-client App - User Login Page', function(){
    let page: ConcreetClientLoginPage;

  beforeEach(() => {
    page = new ConcreetClientLoginPage();
    page.navigateTo().then(function(){
      page.goToLoginPage();
    });
   });
    
    it('User should be able to login when valid credentials are provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().sendKeys("anand@pippintechnologies.com");
        page.getPassword().sendKeys("Admin@123");
        page.getLogInButton().click().then(function(){
            page.browserWait().then(function(){
                page.getCurrentUrl().then(function(currentUrl){
                    expect(currentUrl).toContain('user/home');
                })
            })
        });
    });

    describe('Login Button', function(){
       it('should be disabled when credentials are not provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        expect(page.getEmailId().getText()).toEqual('');
        expect(page.getPassword().getText()).toEqual('');
        expect(page.getLogInButton().isEnabled()).toBe(false);
       });
       it('should be disabled when email is not provided and password is provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        expect(page.getEmailId().getText()).toEqual('');
        page.getPassword().sendKeys("Admin@123");
        expect(page.getLogInButton().isEnabled()).toBe(false);
       });
       it('should be disabled when password is not provided and email is provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().sendKeys("anand@pippintechnologies.com");
        expect(page.getPassword().getText()).toEqual('');
        expect(page.getLogInButton().isEnabled()).toBe(false);
       });
       it('should be disabled when valid password and invalid email is provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().sendKeys("anand@pippintechnologies");
        page.getPassword().sendKeys("Admin@123");
        expect(page.getLogInButton().isEnabled()).toBe(false);
       });
       it('should be enabled when valid password and email is provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().sendKeys("anand@pippintechnologies.com");
        page.getPassword().sendKeys("Admin@123");
        expect(page.getLogInButton().isEnabled()).toBe(true);
       });
    });

    describe('Validation Messages', function(){
       it('should display <E-MAIL IS REQUIRED.> when email is not provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().clear();
        page.getPassword().clear();
        expect(page.getEmailIdError().getText()).toContain("E-MAIL IS REQUIRED");
       });
       it('should display <PASSWORD IS REQUIRED.> when password is not provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getPassword().clear();
        page.getEmailId().clear();
        expect(page.getPasswordError().getText()).toContain("PASSWORD IS REQUIRED.");
       });
      it('should display <E-MAIL IS REQUIRED.> And <PASSWORD IS REQUIRED.> when email and password are not provided.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().clear();
        page.getPassword().clear();
        page.getPassword().clear();
        page.getEmailId().clear();
        expect(page.getEmailIdError().getText()).toContain("E-MAIL IS REQUIRED");
        expect(page.getPasswordError().getText()).toContain("PASSWORD IS REQUIRED.");
       });
       it('should display <ENTER A VALID E-MAIL> when email is not valid.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().sendKeys("anand"); 
        page.getPassword().clear();
        expect(page.getEmailIdError().getText()).toContain("ENTER A VALID E-MAIL");
       });
       it('should display <INVALID CREDENTIALS> when email id or password is not valid.' , function(){
        expect(page.getCurrentUrl()).toContain('user/login');
        page.getEmailId().sendKeys("anand@pippintechnologies.com"); 
        page.getPassword().sendKeys("Admin");     
          page.getLogInButton().click().then(function(){
            page.browserWait().then(function(){
               expect(page.getPasswordError().getText()).toContain("INVALID CREDENTIALS");
            })
        });
        
       });
    });

     describe('Back Button', function(){
        it('should go to pervious page' , function(){
            page.getBackButton().click().then(function(){
            page.browserWait().then(function(){
                page.getCurrentUrl().then(function(currentUrl){
                    expect(currentUrl).toContain('/');
                })
             })
            });       
        });
     });
});