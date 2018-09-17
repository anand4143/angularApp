import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CONSTANTS } from '../../app.constants';
import { Router } from '@angular/router';
import { BookmarkApplicationService, FileService, AuthService } from '../../common';


@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent extends DialogComponent {

  @ViewChild('completeButton') focusedElement: any;
  @ViewChild('userInfo') focusedEle: any;

  event: any;
  verificationItem: any = {};
  Bookmark_Application_ID: string = '';
  constants = CONSTANTS;
  landlordModal: boolean = true;

  constructor(
    dialogService: DialogService,
    private fileSrv: FileService,
    private router: Router,
    private bkmrkAppSrv: BookmarkApplicationService,
    private auth: AuthService
  ) {
    super(dialogService);
    console.log("bkmrkAppSrv.getApplicationStatus(): ", bkmrkAppSrv.getApplicationStatus());
    this.getUserType();
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    if (this.focusedElement != undefined) {
      this.focusedElement.nativeElement.focus();
    }
    if (this.focusedEle != undefined) {
      this.focusedEle.nativeElement.focus();
    }
    console.log(event);
    this.keyUp(event);

  }

  updateStatus(status) {
    this.bkmrkAppSrv.setUserVerificationStatus(this.verificationItem, status)
      .subscribe(() => {
        this.verificationItem.Application_Verification_Status = status;
        this.close();
      });

  }

  gotoReport(renterUserId,type) {
    this.close();
    this.router.navigate([ type + '/' + renterUserId])
  }

  keyUp(event: any) {
    this.event = event;
    console.log("ESCclose:", event);
    if (event.keyCode != undefined) {
      if (event.keyCode == 27) {
        console.log("event.keyCode", event.keyCode);
        this.close();
      }
    }
  }

  getUserType() {
    if (Number(this.auth.getUserType()) == Number(CONSTANTS.userRole.landlord)) {
      this.landlordModal = false;
    }
  }

}
