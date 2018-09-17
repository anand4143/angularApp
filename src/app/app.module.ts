import { NgModule,ElementRef } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { Routes, RouterModule, RouterOutletMap } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { RecaptchaModule } from 'ng2-recaptcha';
import { RecaptchaNoFormsModule } from 'ng2-recaptcha/ng2-recaptcha.noforms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { MyDatePickerModule } from 'mydatepicker';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment'; 

import { AppComponent } from './app.component';

import { AuthGuardService, AuthService, ConfigService, GobackbuttonService,PhonenumberPipe,SsnPipe,FileService, PagerService, PreloaderService, HttpService } from './common';
import { EqualValidator,PasswordValidator,PhoneValidator,EmailValidator,BookmarkApplicationService ,LimitToDirective,NumberOnlyDirective , OrderByPipe,OrderbyDatePipe} from './common';

// Services Block
import { RegisterUserService } from './register-user/register-user.service';
import { RegisterSsnService } from './register-ssn/register-ssn.service';
import { RegisterEmploymentService } from './register-employment/register-employment.service';
import { RegisterIdentificationService } from './register-identification/register-identification.service';
import { RegisterCreditService } from './register-credit/register-credit.service';
import { AddressCheckService } from './address-check/address-check.service';
import { RegisterPayInfoService } from './register-pay-info/register-pay-info.service';
import { BackgroundCheckService } from './background-check/background-check.service';
import { UserSummaryService } from './user-summary/user-summary.service';
import { RegisterW2Service } from './register-w2/register-w2.service';
import { BookmarkService } from './bookmark';
import { WindowRefService } from './common/window/window-ref.service';
import { ForgetService } from './forget/forget.service';

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
//import { SpinnerComponent } from './spinner/spinner.component';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { VerificationComponent } from './dialog/verification/verification.component';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ModalModule } from 'ng2-bootstrap';
import { RegisterNewComponent } from './register-new/register-new.component';
import { UserProgressComponent } from './user-progress/user-progress.component';
import { UserApplyComponent } from './user-apply/user-apply.component';
import { BrokerAcceptComponent } from './broker-accept/broker-accept.component';
import { LandlordApplicationComponent } from './landlord-application/landlord-application.component';
import { BrokerHomeComponent } from './broker-home/broker-home.component';
import { BrokerApplicationComponent } from './broker-application/broker-application.component';
import { LandlordAppDetailComponent } from './landlord-app-detail/landlord-app-detail.component';
import { AddLandlordComponent } from './add-landlord/add-landlord.component';
import { BaseComponent } from './base/base.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { TocComponent } from './toc/toc.component';
import { SuccessComponent } from './dialog/success/success.component';
import { ReleaseComponent } from './dialog/release/release.component';
import { ApplyComponent } from './dialog/apply/apply.component';
import { BookmarkdialogComponent } from './dialog/bookmarkdialog/bookmarkdialog.component';
import { ForgetdialogComponent } from './dialog/forgetdialog/forgetdialog.component';
import { RegisterPayInfoComponent } from './register-pay-info/register-pay-info.component';
import { LandlordDashboardComponent } from './landlord-dashboard/landlord-dashboard.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { RegisterAddressComponent } from './register-address/register-address.component';
import { AddressCheckComponent } from './address-check/address-check.component';
import { CreditReportComponent } from './credit-report/credit-report.component';
import { BackgroundCheckComponent } from './background-check/background-check.component';
import { AddressReportComponent } from './address-report/address-report.component';
import { CreditReportPolicyComponent } from './credit-report-policy/credit-report-policy.component';
import { CreditReportAuthorizeComponent } from './credit-report-authorize/credit-report-authorize.component';
import { BackgroundReportComponent } from './background-report/background-report.component';
import { ForgetComponent } from './forget/forget.component';
import { RequestIdleComponent } from './dialog/request-idle/request-idle.component';
import { ContractInfoComponent } from './contract-info/contract-info.component';
import { ContractInfoService} from './contract-info/contract-info.service';
import { LandlordDocumentComponent } from './landlord-document/landlord-document.component';
import { RenterPaymentComponent } from './renter-payment/renter-payment.component';
import { RenterPaymentService } from './renter-payment/renter-payment.service';
import { RegisterDialogComponent } from './dialog/register-dialog/register-dialog.component';
import { PreloaderFullComponent } from './preloader-full/preloader-full.component';
import { NotificationDialogComponent } from './dialog/notification-dialog/notification-dialog.component';
import { BrokerDocumentsComponent } from './broker-documents/broker-documents.component';
import { RenterDocumentsComponent } from './renter-documents/renter-documents.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AcceptBookmarkDailogComponent } from './dialog/accept-bookmark-dailog/accept-bookmark-dailog.component';
import { CommonDialogComponent } from './dialog/common-dialog/common-dialog.component';
import { LeaseSummaryComponent } from './lease-summary/lease-summary.component';
import { LeaseDocumentsComponent } from './lease-documents/lease-documents.component';
import { LandlordPaymentComponent } from './landlord-payment/landlord-payment.component';
import { TcComponent } from './dialog/tc/tc.component';
import { EditPaypalComponent } from './edit-paypal/edit-paypal.component';


//import { RenterConfirmComponent } from './renter-confirm/renter-confirm.component';

const appRoutes: Routes = [
    { path: '', component : LandingComponent },
    { path: 'landing', component : LandingComponent },
    { path: 'base', component : BaseComponent },
    { path: 'login/:usertype',  component : LoginComponent },
    { path: 'forget/:usertype',  component : ForgetComponent },
    { path: 'about',  component : AboutComponent },
    { path: 'faq', component : FaqComponent },
    { path: 'contact', component : ContactComponent },
    { path: 'tosa',  component : TocComponent },    
    { path: 'change-password', component : ChangePasswordComponent },

   //RENTER
   { path: 'user/register-new', component : RegisterNewComponent },
   { path: 'user/register-user', component : RegisterUserComponent },
   { path: 'user/new/:verifId', component : NewPasswordComponent },
  //  { path: 'user/login', component : LoginComponent },
   { path: 'user/password/change', component : PasswordComponent },
   { path: 'user/usersummary',component:UserSummaryComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-ssn', component : RegisterSsnComponent, canActivate: [AuthGuardService] },
   { path: 'user/register-address', component : RegisterAddressComponent, canActivate: [AuthGuardService] },
   { path: 'user/register-employment', component : RegisterEmploymentComponent, canActivate: [AuthGuardService] },  
   { path: 'user/register-w2', component : RegisterW2Component, canActivate: [AuthGuardService]},
   { path: 'user/register-credit', component : RegisterCreditComponent, canActivate: [AuthGuardService]},
   { path: 'user/address-check', component : AddressCheckComponent, canActivate: [AuthGuardService]},
   { path: 'user/background-check', component : BackgroundCheckComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-identification', component : RegisterIdentificationComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-pay', component : RegisterPayComponent, canActivate: [AuthGuardService]},
   { path: 'user/register-bank', component : RegisterBankComponent, canActivate: [AuthGuardService]},
   { path: 'user/home', component : BookmarkComponent, canActivate: [AuthGuardService]},
   { path: 'user/property/:propId', component : HomeComponent, canActivate: [AuthGuardService]},
   { path: 'user/apply/:bkmrkId', component : UserApplyComponent, canActivate: [AuthGuardService]},
   { path: 'user/documents/:bkmrkId', component : RenterDocumentsComponent, canActivate: [AuthGuardService]},
   { path: 'user/payment/:bkmrkId', component : RenterPaymentComponent, canActivate: [AuthGuardService]},
   //{ path: 'user/accept', component : RenterConfirmComponent, canActivate: [AuthGuardService]},
   { path: 'creport-authorize/:creditInfoId', component : CreditReportAuthorizeComponent, canActivate: [AuthGuardService]},
   { path: 'credit-report/:renterId', component : CreditReportComponent, canActivate: [AuthGuardService]},
   { path: 'background-report/:renterId', component : BackgroundReportComponent, canActivate: [AuthGuardService]},
   //  { path: 'user/credit-report', component : CreditReportComponent, canActivate: [AuthGuardService]},
   { path: 'creport-privacy-policy', component : CreditReportPolicyComponent, canActivate: [AuthGuardService]},
   { path: 'address-report/:renterId', component : AddressReportComponent, canActivate: [AuthGuardService]},
   { path: 'user/leaseSummary/:bkmrkId', component : LeaseSummaryComponent, canActivate: [AuthGuardService]},
   { path: 'user/leaseDocuments/:bkmrkId', component : LeaseDocumentsComponent, canActivate: [AuthGuardService]},


   //BROKER
   { path: 'broker/register-user', component : RegisterUserComponent },
  //  { path: 'broker/login', component : LoginComponent },
   { path: 'broker/password/change', component : PasswordComponent },
   { path: 'broker/property/:propId', component : DashboardComponent, canActivate: [AuthGuardService] },
   { path: 'broker/client/:clientId', component : DashboardComponent, canActivate: [AuthGuardService] },
   { path: 'broker/home', component : BrokerHomeComponent, canActivate: [AuthGuardService] },
   { path: 'broker/usersummary',component:UserSummaryComponent, canActivate: [AuthGuardService]},
   { path: 'broker/register-ssn', component : RegisterSsnComponent, canActivate: [AuthGuardService] },
   { path: 'broker/register-identification', component : RegisterIdentificationComponent, canActivate: [AuthGuardService]},
   { path: 'broker/register-bank', component : RegisterBankComponent, canActivate: [AuthGuardService]},
   { path: 'broker/register-brokerage', component : RegisterBrokerageComponent, canActivate: [AuthGuardService]},

   { path: 'broker/application/:bkmrkId', component : BrokerApplicationComponent, canActivate: [AuthGuardService]},
   { path: 'broker/accept/:bkmrkId', component : BrokerAcceptComponent, canActivate: [AuthGuardService]},
   { path: 'broker/documents/:bkmrkId', component : BrokerDocumentsComponent, canActivate: [AuthGuardService]},
   { path: 'broker/landlord/:bkmrkId', component : AddLandlordComponent, canActivate: [AuthGuardService]},

   //LANDLORD
  //  { path: 'landlord/login', component : LoginComponent },
   { path: 'landlord/home', component : LandlordApplicationComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/property/:propId', component : LandlordDashboardComponent, canActivate: [AuthGuardService] },
   { path: 'landlord/client/:clientId', component : LandlordDashboardComponent, canActivate: [AuthGuardService] },
   { path: 'landlord/apply/:bkmrkId', component : LandlordAppDetailComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/usersummary',component:UserSummaryComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/password/change', component : PasswordComponent },
   { path: 'landlord/register-user', component : RegisterUserComponent },
   { path: 'landlord/register-ssn', component : RegisterSsnComponent, canActivate: [AuthGuardService] },
   { path: 'landlord/register-identification', component : RegisterIdentificationComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/register-bank', component : RegisterBankComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/register-brokerage', component : RegisterBrokerageComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/documents/:bkmrkId', component : LandlordDocumentComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/contract/:bkmrkId', component : ContractInfoComponent, canActivate: [AuthGuardService]},
   { path: 'landlord/paypal', component : EditPaypalComponent , canActivate: [AuthGuardService]},
   { path: 'landlord/paypal-edit', component : RegisterPayInfoComponent , canActivate: [AuthGuardService]},
   { path: 'landlord/payment/:bkmrkId', component : LandlordPaymentComponent, canActivate: [AuthGuardService]},
  
   
   // otherwise redirect to home  
   { path: '**', redirectTo: '/base' }
];
const routing = RouterModule.forRoot(appRoutes);

export function httpServiceFactory(backend: XHRBackend, defaultOptions: RequestOptions, preloaderService: PreloaderService) {
  return new HttpService(backend, defaultOptions, preloaderService);
}

@NgModule({
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
    ConfirmComponent,
    VerificationComponent,
    RegisterNewComponent,
    UserProgressComponent,
    UserApplyComponent,
    BrokerAcceptComponent,
    LandlordApplicationComponent,
    BrokerHomeComponent,
    BrokerApplicationComponent,
    LandlordAppDetailComponent,
    AddLandlordComponent,
    LimitToDirective,
    BaseComponent,
    NumberOnlyDirective,
    AboutComponent,
    FaqComponent,
    ContactComponent,
    TocComponent,
    SuccessComponent,
    ReleaseComponent,
    RegisterPayInfoComponent,
    LandlordDashboardComponent,
    ApplyComponent,
    NewPasswordComponent,
    RegisterAddressComponent,
    AddressCheckComponent,
    CreditReportComponent,
    BackgroundCheckComponent,
    BookmarkdialogComponent,
    AddressReportComponent,
    CreditReportPolicyComponent,
    CreditReportAuthorizeComponent,
    BackgroundReportComponent,
    ForgetComponent,
    ForgetdialogComponent,
    RequestIdleComponent,
    ContractInfoComponent,
    LandlordDocumentComponent,
    RenterPaymentComponent,
    RegisterDialogComponent,
    PreloaderFullComponent,
    OrderByPipe,
    NotificationDialogComponent,
    BrokerDocumentsComponent,
    RenterDocumentsComponent,
    ChangePasswordComponent,
    AcceptBookmarkDailogComponent,
    CommonDialogComponent,
    LeaseSummaryComponent,
    LeaseDocumentsComponent,
    LandlordPaymentComponent,    
    TcComponent,
    EditPaypalComponent,
    OrderbyDatePipe,
    // RenterConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MyDatePickerModule,   
    ReactiveFormsModule ,
    BootstrapModalModule,
    Angular2FontawesomeModule,
    RecaptchaModule.forRoot(),
    ModalModule.forRoot(),
    MomentModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  entryComponents: [
    ConfirmComponent,
    VerificationComponent,
    SuccessComponent,
    ReleaseComponent,
    ApplyComponent,
    BookmarkdialogComponent,
    ForgetdialogComponent,
    RequestIdleComponent,
    RegisterDialogComponent,
    NotificationDialogComponent,
    AcceptBookmarkDailogComponent,
    CommonDialogComponent,
    TcComponent,
  ],
  providers: [
    RouterOutletMap,
    CookieService,
    ConfigService,
    ContractInfoService,
    AuthService,
    AuthGuardService,
    RegisterUserService,
    GobackbuttonService,
    RegisterSsnService,
    RegisterPayInfoService,
    RegisterEmploymentService,
    RegisterCreditService,
    UserSummaryService,
    RegisterW2Service,
    FileService,
    BookmarkService,
    PagerService,
    BookmarkApplicationService,
    RegisterIdentificationService,
    AddressCheckService,
    BackgroundCheckService,
    WindowRefService,
    ForgetService,
    RenterPaymentService,
    PreloaderService,
    {
      provide: HttpService,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions, PreloaderService]
    }

  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
