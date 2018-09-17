import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../bookmark/bookmark.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BookmarkApplicationService, AuthService,GobackbuttonService } from '../common';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';


@Component({
  selector: 'app-lease-summary',
  templateUrl: './lease-summary.component.html',
  styleUrls: ['./lease-summary.component.css']
})
export class LeaseSummaryComponent implements OnInit {

  rent: string = 'NA';
  constructor(
    private router        : Router, 
    private auth          : AuthService,
    private bkmrk         : BookmarkService,
    private bkmAppSrv     : BookmarkApplicationService,
    private gbSrv         : GobackbuttonService,
    private route         :  ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {      
      this.bkmrk.loadNewBookmark(params['bkmrkId'])
      .subscribe((res) =>{
        console.log("res anand==>",res);
        this.rent=res.Property_JSON.price
      });
    });
  }

  leaseDocument(){
    console.log("this.bkmrk.getCurrentBookmark().Bookmark_ID===>",this.bkmrk.getCurrentBookmark().Bookmark_ID);
    this.router.navigate( ["user/leaseDocuments/"+this.bkmrk.getCurrentBookmark().Bookmark_ID] );
  }

   gbf() {
    this.gbSrv.gbf();
  }

}
