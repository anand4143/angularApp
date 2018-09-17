import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BookmarkApplicationService,AuthService } from '../common';
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';
import { BookmarkService } from '../bookmark/bookmark.service';
/**confirm model popup */
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { AcceptBookmarkDailogComponent } from '../dialog/accept-bookmark-dailog/accept-bookmark-dailog.component';
import { DialogService } from "ng2-bootstrap-modal";
/**End confirm model popup */

@Component({
  selector: 'app-broker-home',
  templateUrl: './broker-home.component.html',
  styleUrls: ['./broker-home.component.css']
})
export class BrokerHomeComponent implements OnInit {

  rentApplications: any = [];
  constants = CONSTANTS;
  approvedStatus: boolean = false;
  currentSelectedList: number = 1;
  constructor(
    private router: Router, 
    private bkmrkAppSrv:  BookmarkApplicationService,
    private bkmrkSrv: BookmarkService,
    private dialogService : DialogService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    console.log("broker home onit");
    this.viewApplications();
    console.log("rentApplications:",this.rentApplications);
  }

  viewApplications(){
    this.rentApplications = [];
    this.currentSelectedList = 1;
    console.log("viewApplications");
    this.bkmrkSrv.resetCurrentBookmark();
    console.log("viewApplications1");
    this.bkmrkAppSrv.getAppliedBookmarks()
    .subscribe(bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));

    this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.acceptedBroker)
    .subscribe(bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));

    this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.approvedBroker)
    .subscribe(
      bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));

  //   this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.docLoaded)
  //   .subscribe(
  //     bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));

    // this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.docSigned)
    // .subscribe(
    //   bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));

  //   this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.acceptedLandlord)
  //   .subscribe(
  //     bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));

  //   this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.approvedLandlord)
  //  .subscribe(
  //    bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));

  }

  viewLeasedContracts(){
    this.rentApplications = [];
    this.currentSelectedList = 4;
    this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.leased)
    .subscribe(
      bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));
  }

  viewSignedDocuments(){
    this.rentApplications = [];
    this.currentSelectedList = 2;
    this.bkmrkAppSrv.getBookmarks(this.constants.bookmarkApplicationStatus.docSigned)
    .subscribe(
      bookmarks=>Array.prototype.push.apply(this.rentApplications,bookmarks));
  }

  isSelectedList(listType){
    return listType == this.currentSelectedList;
  }

  brokerAccept(rentApp){
    if(rentApp.Bookmark_Status && (rentApp.Bookmark_Status == CONSTANTS.bookmarkStatus.applied)){
      console.log("I am here and is applied")
      // sessionStorage.setItem("BookmarkRenterId", rentApp.Renter_User_ID);
      // this.router.navigate(['/broker/accept/' + rentApp.Bookmark_ID]); 
       let disposable = this.dialogService.addDialog(AcceptBookmarkDailogComponent, {
          title:'Accept Bookmark?', 
          message:  MESSAGES['TXT24'],
        })
        .subscribe((isConfirmed)=>{
          if(isConfirmed){
            this.bkmrkAppSrv.bookmarkAccept(rentApp.Bookmark_ID, rentApp) 
             .subscribe(
                      ()=>
                         this.router.navigate(['/broker/application/' + rentApp.Bookmark_ID]),
                      (err)=>{
                        console.log("err",err);
              });
            }
        
          }); 
    }
    else{
      console.log("I am here gonna check broker")
      this.bkmrkAppSrv.checkBroker(rentApp.Bookmark_ID)
      .subscribe((res) => {
        console.log("I am here - got broker result")
        console.log(res);
        if(res) {
          sessionStorage.setItem("BookmarkRenterId", rentApp.Renter_User_ID);
          this.router.navigate(['/broker/application/' + rentApp.Bookmark_ID]);
        } else{
          let disposable = this.dialogService.addDialog(ConfirmComponent, {
          title:'Bookmark in Process', 
          message:  'Someone is already working on this bookmark',
          isConfirm: false })
          .subscribe((isConfirmed)=>{});
        }
      })
    }
  }

  getNumOfRecords(){
    return this.rentApplications.length;
  }

  // viewApplication(){
  //   console.log("hello viewApplication");
  //   this.router.navigate(['broker/home']);
  // }


  getCurrentBrokerId(){
    return this.auth.getUserId();
  }
  
}
