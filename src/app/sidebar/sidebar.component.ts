import { Component, OnInit, Input } from '@angular/core';
import { BookmarkService } from '../bookmark/bookmark.service';
import { AuthService, BookmarkApplicationService } from '../common';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { CONSTANTS } from '../app.constants';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { MESSAGES } from '../app.messages';

declare var google: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  list: any;
  locMap: any;
  brokerList: any = {};
  addListLink: boolean = false;
  constants = CONSTANTS;
  brokerLinks: boolean = false;
  landlordLinks: boolean = false;
  errorMsg: String = '';
  messages = MESSAGES;
  currentUrl: String = '';
  prevUrl: String = '';

  constructor(
    private bookmarkService: BookmarkService,
    private bookmarkAppService: BookmarkApplicationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private bkmrk: BookmarkService,
    private auth: AuthService)
  { }

  ngOnInit() {
    if (Number(this.auth.getUserRole()) == this.constants.userRole.renter){ 
      this.bookmarkService.getSidebar();
      this.bookmarkService.setHistoryCount().subscribe();
      this.addListLink = true;
      this.brokerLinks = false;
      this.landlordLinks = false;
      // this.bookmarkService.resetClientButton();
      this.bookmarkService.setBookmarkList().subscribe();
    }
    else {
      if(this.bookmarkService.getClientButtonStatus()) {
        if (Number(this.auth.getUserRole()) == this.constants.userRole.landlord) this.bookmarkService.setClientListForLandlord().subscribe();
      }
      else this.bookmarkService.setBookmarkList().subscribe();
    }


    if (Number(this.auth.getUserRole()) == this.constants.userRole.broker) {
      this.brokerLinks = true;
      this.addListLink = false;
      this.landlordLinks = false;
    }
    if (Number(this.auth.getUserRole()) == this.constants.userRole.landlord) {
      this.landlordLinks = true;
      this.brokerLinks = false;
      this.addListLink = false;
    }
    this.router.events.subscribe(x => {
      if(x instanceof NavigationEnd) {
        this.currentUrl = x.url;
      }
    });
  }

  goToProperty(property) {
    window.scrollTo(0, 0);
    console.log("Going to Property");
    if (Number(this.auth.getUserRole()) == this.constants.userRole.broker) {
      // this.router.navigate(['broker/property/' + property.Property_ID]);
      console.log(this.bookmarkService.getClientButtonStatus())
      if(this.bookmarkService.getClientButtonStatus()) this.router.navigate(['broker/client/' + property.Renter_ID]);
      else this.router.navigate(['broker/property/' + property.Property_ID]);
    }
    else if (Number(this.auth.getUserRole()) == this.constants.userRole.renter) {
      this.bookmarkService.setCurrentBookmark(property);
      this.router.navigate(['user/property/' + property.Source_ID]);
    }
    else {
      if(this.bookmarkService.getClientButtonStatus()) this.router.navigate(['landlord/client/' + property.Renter_ID]);
      else this.router.navigate(['landlord/property/' + property.Property_ID]);
    }
  }

  searchProperties() {
    this.bookmarkService.resetPropertyList();
    this.router.navigate(['/user/home']);
  }

  removeSidebarItem(item) {
    if (item.Bookmark_ID) this.removeBookmark(this.messages.TXT09, item.Bookmark_ID);
    else this.removeHistoryBookmarked(item.Search_History_ID);
  }

  removeBookmark(msg, bookmark_id) {
    var startUrl = this.currentUrl;
    this.errorMsg = '';
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: 'Remove Bookmark?',
      message: msg
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bkmrk.removeBookmark(bookmark_id)
            .subscribe((response) => {
              this.bkmrk.setBookmarkList().subscribe((res)=>{
                if(startUrl != this.currentUrl) this.router.navigate([startUrl]);
                else this.bkmrk.setCurrentBookmark(res[0]);
              });
            },
            (err) => {
              this.errorMsg = MESSAGES[err['code']];
              console.log(err);
            }
            )
        } else {
          console.log("you click cancel button");
        }
      });

  }

  removeHistoryBookmarked(searchHistoryId) {
    this.prevUrl = this.currentUrl;
    this.bkmrk.removeHistoryBookmark(searchHistoryId).subscribe((res) => {
      this.setHistoryList();
    })

  }

  setPriorityOfBookmark(bookmark_id, priority) {
    var newPriority: number;
    if (priority == 1) newPriority = 0;
    else newPriority = 1;
    this.bkmrk.setPriorityOfBookmark(bookmark_id, newPriority)
      .subscribe((response) => {
        this.bkmrk.setBookmarkList().subscribe();
      },
      (err) => {
        console.log(err);
      });
  }

  setHistoryList() {
    this.bkmrk.setHistoryList().subscribe((res) => {
      if(res.length && this.prevUrl == this.currentUrl) this.goToProperty(res[0]);
      else if(!res.length && this.prevUrl == this.currentUrl) {
        this.bookmarkService.resetPropertyList();
        this.router.navigate(['user/home']);
      }
      else this.router.navigate([this.prevUrl]);
    });
  }

  setHistory(){
    this.bkmrk.setHistoryList().subscribe((res) => {
      this.goToProperty(res[0])
    });
  }

  setBookmarkList() {
    this.bkmrk.setBookmarkList().subscribe((res) => this.goToProperty(res[0]))
  }

  getClosedApplications(){
    this.bkmrk.resetSideBarStatus();
    if(this.bkmrk.getClientButtonStatus()){
      this.bookmarkService.setClientListForBroker().subscribe((sidebarList)=>{
        if(sidebarList.length)this.goToProperty(sidebarList[0]);
        else this.router.navigate([this.auth.getRoute('home')]);
      });
    }
    else this.bkmrk.setBookmarkList()
    .subscribe((res) => {
      if(res.length)this.goToProperty(res[0])
      else {
        this.bookmarkService.resetCurrentBookmark();
        this.bookmarkAppService.resetAll();
        this.router.navigate(['broker/home']);
      }
    });
  }

  getCurrentApplications(){
    console.log('client btn status',this.bkmrk.getClientButtonStatus())
    this.bkmrk.setSideBarStatus();
    if(this.bkmrk.getClientButtonStatus()){
      this.bookmarkService.setClientListForBroker().subscribe((sidebarList)=>{
        if(sidebarList.length)this.goToProperty(sidebarList[0]);
        else this.router.navigate([this.auth.getRoute('home')]);
      });
    }
    else this.bkmrk.setBookmarkList()
    .subscribe((res) => {
      if(res.length)this.goToProperty(res[0])
      else {
        this.bookmarkService.resetCurrentBookmark();
        this.bookmarkAppService.resetAll();
        this.router.navigate(['broker/home']);
      }
    });
  }

  setClientListing(){
    this.bookmarkService.setClientButton();
    if(Number(this.auth.getUserRole()) == CONSTANTS.userRole.landlord) {
      this.bookmarkService.setClientListForLandlord().subscribe((sidebarList)=>{
        if(sidebarList.length)this.goToProperty(sidebarList[0]);
        else this.router.navigate([this.auth.getRoute('home')]);
      });
    }
    else if(Number(this.auth.getUserRole()) == CONSTANTS.userRole.broker) {
      this.bookmarkService.setClientListForBroker().subscribe((sidebarList)=>{
        if(sidebarList.length)this.goToProperty(sidebarList[0]);
        else this.router.navigate([this.auth.getRoute('home')]);
      });
    }
    else 
      this.bookmarkService.setBookmarkList().subscribe((sidebarList)=>{
        if(sidebarList.length)this.goToProperty(sidebarList[0]);
        else this.router.navigate([this.auth.getRoute('home')]);
      });
    
  }

  resetClientListing(){
    this.bookmarkService.resetClientButton();
    this.bookmarkService.setBookmarkList().subscribe((sidebarList)=>{
      if(sidebarList.length)this.goToProperty(sidebarList[0]);
      else this.router.navigate([this.auth.getRoute('home')]);
    });
  }

  

  
}
