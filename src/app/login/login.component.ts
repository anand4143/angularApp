import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService, EqualValidator, PasswordValidator, EmailValidator, GobackbuttonService, BookmarkApplicationService } from '../common';
import { UserSummaryService } from '../user-summary/user-summary.service'
import { RegisterPayInfoService } from '../register-pay-info/register-pay-info.service'
import { BookmarkService } from '../bookmark/bookmark.service';
import { MESSAGES } from '../app.messages';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  lnMdl: any = {};
  error = '';
  lnFrm: FormGroup;
  errorMessage: string = '';
  errorType: string = '';
  userType: any = {};
  constructor(private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private frmbuilder: FormBuilder,
    private userInfo: UserSummaryService,
    private gbSrv: GobackbuttonService,
    private bookmarkService: BookmarkService,
    private bookmarkApplicationService: BookmarkApplicationService,
    private regPayInfoService: RegisterPayInfoService
  ) {
    this.lnFrm = frmbuilder.group({
      'Email_Address': [null, Validators.required],
      'User_Password': [null, Validators.required],
    })
    this.lnFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.auth.logout();
    this.route.params.subscribe((params: Params) => {
      console.log("URL UserType==> ", params['usertype']);
      if (params['usertype']) {
        this.auth.setUserType(params['usertype']);
        this.userType = this.auth.getUserType();
      }
    });
    this.auth.setEmailIdForForgetPwd('');
    console.log('email id Login', this.auth.getEmailIdForForgetPwd());
  }

  loginUser() {
    this.errorType = '';
    this.errorMessage = '';
    this.bookmarkService.resetAll();
    this.bookmarkApplicationService.resetAll();
    this.userInfo.resetAll();
    this.regPayInfoService.resetAll();
    this.auth.login(this.lnMdl)
      .subscribe(
      (user) => {
        // this.userInfo.updateProgress();
        this.bookmarkService.setBookmarkList()
          .subscribe(() => {
            if (this.bookmarkService.getBookmarkList().length != 0) {
              // console.log("first bookmarkID:",this.bookmarkService.getCurrentBookmark().Bookmark_ID);
              this.router.navigate([this.auth.getRoute('home')]);
            } else {
              console.log("Inside else");
              this.router.navigate(['/user/bookmark']);
            }
          })
      },
      err => {
        console.log("err:", err);
        this.errorType = err.msg;
        this.errorMessage = MESSAGES[err.code];
        console.log("this.errorType:", this.errorType);
        console.log("this.errorMessage:", this.errorMessage);
      }
      );

  }

  toRegister() {
    this.router.navigate(['/']);
  }

  forget(email_id) {
    if (email_id != undefined) {
      this.auth.setEmailIdForForgetPwd(email_id);
      console.log('email id', email_id);
    }
    this.router.navigate(['/forget/' + this.userType]);
  }

}
