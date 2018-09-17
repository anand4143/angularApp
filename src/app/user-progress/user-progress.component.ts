import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../bookmark';
import { CONSTANTS } from '../app.constants';
import { AuthService, BookmarkApplicationService } from '../common';
import { Router, ActivatedRoute }  from '@angular/router';


@Component({
  selector: 'app-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.css']
})
export class UserProgressComponent implements OnInit {
  private constants = CONSTANTS;
  userRole:boolean = true;
  constructor(
    private bkmSrv:BookmarkService,
    private bkmAppSrv:BookmarkApplicationService,
    private router: Router,
    private route:ActivatedRoute,
    private auth:AuthService
  ) { }

  ngOnInit() {
    if(parseInt(this.auth.getUserRole())== CONSTANTS.userRole.broker){
      this.userRole = false;
    }
     //console.log("user progress User role:",this.userRole);     
  }

  checkRoute(type){
    return this.route.routeConfig.path.includes(type);
  }

  checkCompletedStatus(status){
    return Number(this.bkmSrv.getCurrentBookmarkStatus()) > Number(status);
  }

  checkApprovalStatus(status){
    return Number(this.bkmAppSrv.getApplicationStatus()) > Number(status);
  }
  
  checkDisabledStatus(status){
    return Number(this.bkmSrv.getCurrentBookmarkStatus()) < Number(status);
  }

  gotoApplication(){
    //console.log(this.checkDisabledStatus(this.constants.bookmarkStatus.inProcess))
    if(!this.checkDisabledStatus(this.constants.bookmarkStatus.inProcess))
      this.router.navigate( [ this.auth.getRoute('apply')  + "/"  + this.bkmSrv.getCurrentBookmark().Bookmark_ID ] );
  }

  gotoPayments(){
    this.router.navigate( [ '/user/payment/' + this.bkmSrv.getCurrentBookmark().Bookmark_ID ] );
  }

  
}
