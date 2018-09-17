import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BookmarkApplicationService,AuthService } from '../common';
import { CONSTANTS } from '../app.constants';
/**confirm model popup */
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { BookmarkdialogComponent } from '../dialog/bookmarkdialog/bookmarkdialog.component';
import { DialogService } from "ng2-bootstrap-modal";
/**End confirm model popup */
import { BookmarkService} from '../bookmark';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constants = CONSTANTS;
  private applications:any=[];
  private propertyPage:boolean = true;

  constructor(
      private router: Router, 
      private route: ActivatedRoute,
      private bkmrkAppSrv:  BookmarkApplicationService,
      private bkmrkSrv: BookmarkService,
      private dialogService : DialogService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      // this.bkmrkSrv.setBookmark(params['propId'])
      // .subscribe((bkmrk)=>{
      //   this.bkmrkAppSrv.setCurrentBookmark(bkmrk);
      //   this.bkmrkAppSrv.setApplications(params['propId']);
      // });
      if(params['propId']){
        console.log("I am in here...");
        this.propertyPage = true;
        this.bkmrkSrv.setBookmark(params['propId'])
        .subscribe((bkmrk)=>{
          this.bkmrkSrv.loadNewBookmark(bkmrk.Bookmark_ID).subscribe();
          this.bkmrkAppSrv.setCurrentBookmark(bkmrk);
          this.bkmrkAppSrv.setApplications(params['propId']);
        });
      } else {
        // :clientId
        console.log("Did I reach here..")
        this.propertyPage = false;
        this.bkmrkSrv.setClient(params['clientId']);
        this.bkmrkSrv.setRenterDetails(params['clientId']).subscribe();
        this.bkmrkAppSrv.setClientListingsForBroker(params['clientId']).subscribe();
      }
    })
    
    // this.applications = [];
    // this.route.params.subscribe((params: Params) => {
    //   if(params['propId']) {
    //     console.log("property id broker dashboard:",params['propId']);
    //     this.bkmrkSrv.setBookmark(params['propId']).subscribe();
    //     this.bkmrkAppSrv.getApplications(params['propId'])
    //     .subscribe((applic)=>{
    //       console.log("applic: ",applic);
    //       Array.prototype.push.apply(this.applications,applic);
    //       //this.applications.push(applic);
    //       console.log("this.applications applic",this.applications);
    //     });
    //     this.bkmrkSrv.getAppliedBookmarks(params['propId'])
    //     .subscribe((applied)=>{
    //       console.log("applied: ",applied);
    //       Array.prototype.push.apply(this.applications,applied);
    //        //this.applications.push(applied);
    //       console.log("this.applications applied",this.applications);
    //     });
    //     console.log("this.applications Final: ",this.applications);
    //   }
    // });
     
  }

  brokerAccept(rentApp){
    console.log("brokerAccept component:",rentApp);
    this.bkmrkAppSrv.setCurrentBookmark(rentApp);
    console.log("brokerAccept.Bookmark_Status: ",rentApp);
    console.log("rentApp.Bookmark_Status:",rentApp.Bookmark_Status);
    if(rentApp.Bookmark_Status){
      if(rentApp.Bookmark_Status == CONSTANTS.bookmarkStatus.toBeApplied){
        console.log("inside if");
        // console.log("rentApp.Bookmark_Status:",rentApp.Bookmark_Status);
        // console.log("CONSTANTS.bookmarkStatus.applied:",CONSTANTS.bookmarkStatus.applied);
        // sessionStorage.setItem("BookmarkRenterId", rentApp.Renter_User_ID);
        // this.router.navigate(['/broker/accept/']);
         let disposable = this.dialogService.addDialog(BookmarkdialogComponent, {
            title:'Bookmark', 
            message:  rentApp.User_First_Name +' '+ rentApp.User_Last_Name + ' on interested this property',
            isConfirm: false })
            .subscribe((isConfirmed)=>{
              console.log("hellloooooo");
            });  
      }else if(rentApp.Bookmark_Status == CONSTANTS.bookmarkStatus.applied){
        console.log("rentApp.Bookmark_Status:",rentApp.Bookmark_Status);
        console.log("CONSTANTS.bookmarkStatus.applied:",CONSTANTS.bookmarkStatus.applied);
        sessionStorage.setItem("BookmarkRenterId", rentApp.Renter_User_ID);
        this.router.navigate(['/broker/accept/']);  
      }else if(rentApp.Bookmark_Status > CONSTANTS.bookmarkStatus.applied){
        this.bkmrkAppSrv.checkBroker(rentApp.Bookmark_ID)
        .subscribe((res) => {
          console.log(res);
          if(res) {
            sessionStorage.setItem("BookmarkRenterId", rentApp.Renter_User_ID);
            this.router.navigate(['/broker/application/' + rentApp.Bookmark_ID]);
          } else{
            let disposable = this.dialogService.addDialog(ConfirmComponent, {
            title:'Bookmark in Process', 
            message:  'A different Broker is already working on this bookmark',
            isConfirm: false })
            .subscribe((isConfirmed)=>{});
          }
        })
      }
    }else if(rentApp.Bookmark_Application_Status >= CONSTANTS.bookmarkApplicationStatus.acceptedBroker){
      this.bkmrkAppSrv.checkBroker(rentApp.Bookmark_ID)
        .subscribe((res) => {
          console.log(res);
          if(res) {
            sessionStorage.setItem("BookmarkRenterId", rentApp.Renter_User_ID);
            this.router.navigate(['/broker/application/' + rentApp.Bookmark_ID]);
          } else{
            let disposable = this.dialogService.addDialog(ConfirmComponent, {
            title:'Bookmark in Process', 
            message:  'A different Broker is already working on this bookmark',
            isConfirm: false })
            .subscribe((isConfirmed)=>{});
          }
        })
      // this.router.navigate(['/broker/application/' + rentApp.Bookmark_ID]);
    }
  }
  

  getCurrentBrokerId(){
    return this.auth.getUserId();
  }

}
