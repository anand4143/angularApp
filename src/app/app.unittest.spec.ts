import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule, RouterOutletMap } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
//import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { RecaptchaModule } from 'ng2-recaptcha';
import { RecaptchaNoFormsModule } from 'ng2-recaptcha/ng2-recaptcha.noforms';

import { AppComponent } from './app.component';


import { AuthGuardService, AuthService, ConfigService, GobackbuttonService,PhonenumberPipe,SsnPipe,FileService, PagerService } from './common';
import { EqualValidator,PasswordValidator,PhoneValidator,EmailValidator } from './common';

// Services Block
import { RegisterUserService } from './register-user/register-user.service';
import { RegisterSsnService } from './register-ssn/register-ssn.service';
import { RegisterEmploymentService } from './register-employment/register-employment.service';
import { UserSummaryService } from './user-summary/user-summary.service';
import { RegisterW2Service } from './register-w2/register-w2.service';
import { BookmarkService } from './bookmark';

// Component Block
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterProgressComponent } from './register-progress/register-progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import { RegisterSsnComponent } from './register-ssn/register-ssn.component';
import { RegisterEmploymentComponent } from './register-employment/register-employment.component';
import { RegisterCreditComponent } from './register-credit/register-credit.component';
import { RegisterIdentificationComponent } from './register-identification/register-identification.component';
import { RegisterPayComponent } from './register-pay/register-pay.component';
import { RegisterBankComponent } from './register-bank/register-bank.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { RegisterBrokerageComponent } from './register-brokerage/register-brokerage.component';
import { RegisterW2Component } from './register-w2/register-w2.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { PasswordComponent } from './password/password.component';
import { HomeComponent } from './home/home.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from './confirm/confirm.component';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { RegisterNewComponent } from './register-new/register-new.component';

const appRoutes: Routes = [
   { path: '', component : LandingComponent },

   //RENTER
   { path: 'user/register-new', component : RegisterNewComponent },
   { path: 'user/register-user', component : RegisterUserComponent },
   { path: 'user/login', component : LoginComponent },
   { path: 'user/password/change', component : PasswordComponent },
   { path: 'user/usersummary',component:UserSummaryComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-ssn', component : RegisterSsnComponent, canActivate: [AuthGuardService] },
   { path: 'user/register-employment', component : RegisterEmploymentComponent, canActivate: [AuthGuardService] },
   { path: 'user/register-w2', component : RegisterW2Component, canActivate: [AuthGuardService]},
   { path: 'user/register-credit', component : RegisterCreditComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-identification', component : RegisterIdentificationComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-pay', component : RegisterPayComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-bank', component : RegisterBankComponent, canActivate: [AuthGuardService]},
   { path: 'user/bookmark', component : BookmarkComponent, canActivate: [AuthGuardService]},
   { path: 'user/home', component : HomeComponent, canActivate: [AuthGuardService]},
   
   //BROKER
   { path: 'broker/register-user', component : RegisterUserComponent },
   { path: 'broker/login', component : LoginComponent },
   { path: 'broker/password/change', component : PasswordComponent },
   { path: 'broker/home', component : DashboardComponent, canActivate: [AuthGuardService] },
   { path: 'broker/usersummary',component:UserSummaryComponent, canActivate: [AuthGuardService]},
   { path: 'broker/register-ssn', component : RegisterSsnComponent, canActivate: [AuthGuardService] },
   { path: 'broker/register-identification', component : RegisterIdentificationComponent, canActivate: [AuthGuardService]},
   { path: 'broker/register-bank', component : RegisterBankComponent, canActivate: [AuthGuardService]},
   { path: 'broker/register-brokerage', component : RegisterBrokerageComponent, canActivate: [AuthGuardService]},
   
   // otherwise redirect to home  
   { path: '**', redirectTo: '/' }
];

const routing = RouterModule.forRoot(appRoutes);
beforeEach(async(() => {
TestBed.configureTestingModule({
    declarations: [
                    AppComponent,
                    HeaderComponent,
                    FooterComponent,
                    EqualValidator,
                    PasswordValidator,
                    PhoneValidator,
                    EmailValidator,
                    LandingComponent,
                    LoginComponent,
                    RegisterProgressComponent,
                    DashboardComponent,
                    UserSummaryComponent,
                    RegisterSsnComponent,
                    RegisterEmploymentComponent,
                    PhonenumberPipe,
                    SsnPipe,
                    RegisterCreditComponent,
                    RegisterIdentificationComponent,
                    RegisterPayComponent,
                    RegisterBankComponent,
                    RegisterUserComponent,
                    RegisterBrokerageComponent,
                    RegisterW2Component,
                    SidebarComponent,
                    BookmarkComponent,
                    PasswordComponent,
                    HomeComponent,
                    SpinnerComponent,
                    ConfirmComponent,
                    RegisterNewComponent       
    ],
    imports: [
                    BrowserModule,
                    FormsModule,
                    HttpModule,
                    routing,   
                    ReactiveFormsModule ,
                    BootstrapModalModule,
                    RecaptchaModule.forRoot()   
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue : '/' },
        RouterOutletMap,
        CookieService,
        ConfigService,
        AuthService,
        AuthGuardService,
        RegisterUserService,
        GobackbuttonService,
        RegisterSsnService,
        RegisterEmploymentService,
        UserSummaryService,
        RegisterW2Service,
        FileService,
        BookmarkService,
        PagerService
    ]
});  
    TestBed.compileComponents();
}));
