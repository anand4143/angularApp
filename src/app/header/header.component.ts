import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common';
import { BookmarkService } from '../bookmark/bookmark.service';
import { CONSTANTS } from '../app.constants';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { NotificationDialogComponent } from '../dialog/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constants = CONSTANTS
  constructor(
    private bookmarkService: BookmarkService,
    private auth: AuthService,
    private router: Router,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
  }

  isLoginScreen() {
    return !this.auth.isLoggedIn();
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.bookmarkService.setpropertySearchQuery({ aptnumber: '', city: '', locality: '', state: '', zipCode: '' });
    this.auth.logout();
    this.router.navigate(['/']);
  }

  getNotificationDialog() {
    let disposable = this.dialogService.addDialog(NotificationDialogComponent, {
      title: 'Notification',
      message: this.auth.getNotification()
    }).subscribe(() => {
      console.log("now u are inside");
      console.log(this.auth.getNotification());
    });

  }

  changePassword() {
    console.log("change password");
    this.router.navigate(['/change-password']);
  }


}
