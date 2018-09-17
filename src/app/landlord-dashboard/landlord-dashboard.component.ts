import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BookmarkService} from '../bookmark';
import { CONSTANTS } from '../app.constants';
import { BookmarkApplicationService,AuthService } from '../common';

@Component({
  selector: 'app-landlord-dashboard',
  templateUrl: './landlord-dashboard.component.html',
  styleUrls: ['./landlord-dashboard.component.css']
})
export class LandlordDashboardComponent implements OnInit {
  private applications:any=[];
  private constants=CONSTANTS;
  private propertyPage:boolean = true;

  constructor(
      private router: Router, 
      private route: ActivatedRoute,
      private bkmrkAppSrv:  BookmarkApplicationService,
      private bkmrkSrv: BookmarkService,      
      private auth: AuthService
  ) {
    
   }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      //If Client Menu, we need to get the client detail and corrsponding property details
      // console.log('params[propId]: ', params['propId'])
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
        this.bkmrkAppSrv.setClientListingsForLandlord(params['clientId']).subscribe();
      }
    })

    // this.route.params.subscribe((params: Params) => {
    //   if(params['propId']) {
    //     this.bkmrkSrv.setBookmark(params['propId']).subscribe();
    //     this.bkmrkAppSrv.getApplications(params['propId'])
    //       .subscribe((result)=>{
    //         console.log("In NGINIT: ", result)
    //         this.applications = result;
    //         console.log("In NGINIT APP: ", this.applications)
    //       });
    //     }
    //   });

  }

  gotoDetails(renter){
    this.router.navigate(['/landlord/apply/' + renter.Bookmark_ID]);
  }

}
