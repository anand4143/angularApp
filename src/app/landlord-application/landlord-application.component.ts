import { Component, OnInit,ViewChild } from '@angular/core';
import { BookmarkService } from '../bookmark/bookmark.service';
import { Router } from '@angular/router';
import { BookmarkApplicationService } from '../common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CONSTANTS } from '../app.constants';


@Component({
  selector: 'app-landlord-application',
  templateUrl: './landlord-application.component.html',
  styleUrls: ['./landlord-application.component.css']
})
export class LandlordApplicationComponent implements OnInit {

  constants=CONSTANTS
   //boxArray: any = [];
  approvedApplications:any=[];
  currentSelectedList: number = 1;

  constructor(
    private router: Router, 
    private bkmrkSrv:  BookmarkService ,
    private bkmrkAppSrv: BookmarkApplicationService
    
  ) { }

  ngOnInit() {
    console.log("Inside landlord App")
    //this.bkmrkSrv.setCurrentBookmark(null);
    this.bkmrkSrv.resetCurrentBookmark();
    this.bkmrkAppSrv.getLandlordApplications()
    .subscribe(bookmarks=>Array.prototype.push.apply(this.approvedApplications,bookmarks));    
  }

  viewApplications(){
    this.approvedApplications= [];
    this.currentSelectedList = 1;
    this.bkmrkSrv.resetCurrentBookmark();
    this.bkmrkAppSrv.getLandlordApplications()
    .subscribe(bookmarks=>Array.prototype.push.apply(this.approvedApplications,bookmarks));
  }

  viewLeasedContracts(){
    this.approvedApplications= [];
    this.currentSelectedList = 2;
    this.bkmrkSrv.resetCurrentBookmark();
    this.bkmrkAppSrv.getLandlordContracts()
    .subscribe(bookmarks=>Array.prototype.push.apply(this.approvedApplications,bookmarks));
  }

   getNumOfRecords(){
    return this.approvedApplications.length;
  }

  isSelectedList(listType){
    return listType == this.currentSelectedList;
  }

  markSelect(item){
    this.router.navigate(['/landlord/apply/' + item.Bookmark_ID]);
  }
  
}
