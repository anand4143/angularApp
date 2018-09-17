import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../bookmark/bookmark.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BookmarkApplicationService, AuthService,GobackbuttonService } from '../common';
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';
/**confirm model popup */
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { DialogService } from "ng2-bootstrap-modal";
/**End confirm model popup */


@Component({
  selector: 'app-broker-accept',
  templateUrl: './broker-accept.component.html',
  styleUrls: ['./broker-accept.component.css']
})
export class BrokerAcceptComponent implements OnInit {
 boxArray: any = [];
   constants = CONSTANTS;
  rmBookmark: boolean = false;
  backBtn   : boolean = true;
  acceptError='';
 // userRole: boolean;
  constructor(
    private router        : Router, 
    private route         : ActivatedRoute,
    private auth          : AuthService,
    private bkmrk         :  BookmarkService,
    private bkmAppSrv     : BookmarkApplicationService,
    private dialogService : DialogService,
    private gbSrv         : GobackbuttonService,
    
  ) {
    
   }

  ngOnInit() {  
      this.backBtn = false;
      this.route.params.subscribe((params: Params) => {
      console.log("URL BookmarkID==> ",params['bkmrkId']);
        if(params['bkmrkId']) {
          this.bkmrk.loadNewBookmark(params['bkmrkId'])
          .subscribe((result)=>{
            if(result.Bookmark_Status > CONSTANTS.bookmarkStatus.applied) this.router.navigate(['/broker/home']);
          });
          this.bkmAppSrv.setSelectedBookmarkId(params['bkmrkId']);
          this.bkmAppSrv.setBookmarkRenterInfo(params['bkmrkId']);
        }
      });
  }

  
  apply(){
    this.bkmrk.bookmarkApply()
    .subscribe(result => { });
    //.subscribe(result => this.router.navigate(['/user/apply']));
    
  }

  addNewBookmark(){ 

    this.bkmrk.bookmarkProperty(this.bkmrk.getCurrentBookmark())
     .subscribe((result)=>{
        this.backBtn = true;
       this.bkmrk.setBookmarkList()
       .subscribe(()=>{
       console.log("This is add new bookmark function",this.backBtn);       
       });           
     },
     (error)=>{
       console.log(error);
     })
    
  }

  removeBookmark(msg){
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title:'Bookmark', 
      message:  msg })
      .subscribe((isConfirmed)=>{
        //We get dialog result                    
        if(isConfirmed) {
           this.bkmrk.removeBookmark(this.bkmrk.getCurrentBookmark().Bookmark_ID)
          .subscribe((response)=> { 
             this.bkmrk.setBookmarkList(); 
             this.rmBookmark = true;
            console.log("Delete Bookmark msg:",response); 
            this.router.navigate(['user/bookmark']);         
            },
            (err) => {
              console.log(err);
            }
          )
        }else {
            console.log("you click cancel button");
        }
    });

  }

  gbf() {
    this.gbSrv.gbf();
  }

  acceptApplication(){
    this.bkmAppSrv.bookmarkAccept(this.bkmAppSrv.getSelectedBookmarkId(), this.bkmrk.getCurrentBookmark()) 
      .subscribe(
        ()=>this.router.navigate(['/broker/application/' + this.bkmAppSrv.getSelectedBookmarkId()]),
        (err)=>{
           this.acceptError=MESSAGES[err.code];
        });
      
    // console.log("getCurrentBookmark accept id:",this.bkmAppSrv.getCurrentBookmark()['Bookmark_ID']);
    // this.bkmAppSrv.bookmarkAccept(this.bkmAppSrv.getCurrentBookmark()['Bookmark_ID']) 
    //   .subscribe(()=>this.router.navigate(['/broker/application/' + this.bkmAppSrv.getCurrentBookmark()['Bookmark_ID']]));
  }

  checkIsArray(item){
    return Array.isArray(item);
  }

}
