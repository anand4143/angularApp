import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService, EqualValidator, PasswordValidator, EmailValidator, GobackbuttonService, BookmarkApplicationService } from '../common';
import { UserSummaryService } from '../user-summary/user-summary.service';
import { ForgetService } from './forget.service';
import { ForgetdialogComponent } from '../dialog/forgetdialog/forgetdialog.component';
import { BookmarkService } from '../bookmark/bookmark.service';
import { MESSAGES } from '../app.messages';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {

  forgetModel: any = {};
  userType: any = {};
  errorMessage: string = '';
  forgetFrm: FormGroup;
  submitBut: boolean = false;
  error = '';


  errorType: string = '';
  constructor(private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private frmbuilder: FormBuilder,
    private userInfo: UserSummaryService,
    private gbSrv: GobackbuttonService,
    private bookmarkService: BookmarkService,
    private bookmarkApplicationService: BookmarkApplicationService,
    private dialogService: DialogService,
    private frgetSrv: ForgetService,
  ) {
    this.forgetFrm = frmbuilder.group({
      'Email_Address': [null, Validators.required],
    })
    this.forgetFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.submitBut = false;
    this.auth.logout();
    this.route.params.subscribe((params: Params) => {
      console.log("URL UserType==> ", params['usertype']);
      if (params['usertype']) {
        this.auth.setUserType(params['usertype']);
        this.userType = this.auth.getUserType();
      }
    });
    if (this.auth.getEmailIdForForgetPwd() != undefined) {
      this.forgetModel.Email_Address = this.auth.getEmailIdForForgetPwd();
      console.log('this.forgetModel.Email_Address ', this.forgetModel.Email_Address);
    }
  }


  getPassword() {
    this.submitBut = true;
    this.errorType = '';
    this.errorMessage = '';
    this.bookmarkService.resetAll();
    this.bookmarkApplicationService.resetAll();
    this.userInfo.resetAll();
    console.log("this.forgetModel first time:", this.forgetModel);
    this.forgetModel.User_Role = Number(this.userType);

    this.frgetSrv.forgetPassword(this.forgetModel)
      .subscribe(
      (res) => {
        console.log("component response:", res);
        let disposable = this.dialogService.addDialog(ForgetdialogComponent, {
          title: 'Forget Password',
          message: MESSAGES['TXT07']
        })
          .subscribe((confirm) => {
            console.log("now i am here");
            this.submitBut = false;
            this.router.navigate(['/login/' + this.userType]);
          },
          (close) => {
            console.log("you click close");
          });
      },
      (err) => {
        console.log("err:", err);
        this.errorMessage = MESSAGES[err.code];
        console.log("this.errorMessage:", this.errorMessage);
        this.submitBut = false;
      });
  }

  enableSubmit(event: any) {
    this.submitBut = false;
    this.errorMessage = '';
  }

  toRegister() {
    if (this.auth.getEmailIdForForgetPwd() != undefined) {
      this.forgetModel.Email_Address = '';
      console.log('this.forgetModel.Email_Address ', this.forgetModel.Email_Address);
    }
    this.router.navigate(['/']);
  }

}
