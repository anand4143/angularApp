import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../bookmark/bookmark.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BookmarkApplicationService, AuthService,GobackbuttonService } from '../common';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';
/**confirm model popup */
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { SuccessComponent } from '../dialog/success/success.component';
import { ApplyComponent } from '../dialog/apply/apply.component';
import { UserSummaryService } from '../user-summary/user-summary.service';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CookieService } from 'angular2-cookie/core';
/**End confirm model popup */
declare var google: any; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constants = CONSTANTS;
  messages  = MESSAGES;
  isRequesting  : boolean = false;
  rmBookmark    : boolean = false;
  backBtn       : boolean = true;
  bookmarkBtn   : boolean = false;
  errorVar      : boolean = false;
  errorMsg      : String  = ''; 
  locMap        : any;
  
  constructor(
    private router        : Router, 
    private auth          : AuthService,
    private bkmrk         : BookmarkService,
    private bkmAppSrv     : BookmarkApplicationService,
    private dialogService : DialogService,
    private cookies       : CookieService,
    private gbSrv         : GobackbuttonService,
    private route         :  ActivatedRoute,
    private usrSumm       : UserSummaryService
  ) {
    
   }

  ngOnInit() {    
    this.backBtn = false;
    this.isRequesting = true;
    this.route.params.subscribe((params: Params) => {
      this.bkmrk.getNioProperty(params['propId'])
      .subscribe((response) => {      
          if(response) {
            if(response.Bookmark_Status > CONSTANTS.bookmarkStatus.applied){
                this.bkmAppSrv.setSelectedBookmarkId(response.Bookmark_ID);
                this.bkmAppSrv.getApplication().subscribe((res)=>{  });
              }
            this.bkmrk.setBookmark(response.Property_ID)
            .subscribe((res)=>{
              this.isRequesting = false;
              this.setLocation();

                           
            });
          }else{             
            this.isRequesting = false;
            if(this.bkmrk.getCurrentBookmark()){              
              if(this.bkmrk.getCurrentBookmark().Source_ID != params['propId']) this.router.navigate(['user/home']);
              else this.bkmrk.getHistoryDetails(params['propId']);
            } 
            else this.router.navigate(['user/home']);
          }           
      });
    });

  }

  setLocation(){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': this.bkmrk.getPropAddress()
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var options = {
                zoom: 12,
                minZoom: 2,
                maxZoom: 20,
                center: results[0].geometry.location,//{lat: 40.730610, lng: -73.935242},
                disableDefaultUI: true,
                zoomControl: true,
                scrollwheel : false,
                mapTypeId : google.maps.MapTypeId.ROADMAP
            };
            this.locMap = new google.maps.Map(document.getElementById('_map'), options);          
            google.maps.event.addListenerOnce(options, 'idle', function() {
              google.maps.event.trigger(options, 'resize');
            });   
            this.locMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: this.locMap,
                position: results[0].geometry.location
            });
            document.getElementById('_mapParent').classList.remove("active");          
        }
    });
  }
  
  apply(msgCode){
    this.errorMsg = '';
    var response=[];
    this.usrSumm.resetInfo();
    this.isRequesting=true;
    this.usrSumm.updateProgress().subscribe((resp)=>{
       console.log("Catching Response: ",response);
       console.log("Catching response.length: ",response.length);
       response.push(resp);
      if(response.length == 14){
        console.log("Im am done",response);
        console.log("can apply",this.usrSumm.canApply())
        
        if(this.usrSumm.canApply()){
          console.log("Applying..")
          console.log("code:",MESSAGES[msgCode]);
          let msg = MESSAGES[msgCode];
          this.shareReportDialog();
          
        } else {
          this.isRequesting=false;
          this.goToUserSummary();

        }
      } 
      
    },(error)=>{
      response.push(error);
      console.log("err:",error);
      if(response.length == 12) { 
       this.isRequesting=false;
       this.goToUserSummary();}
    });
  }

  applyBookmark(){
    this.bkmrk.bookmarkApply()
      .subscribe(result => {
        let disposable = this.dialogService.addDialog(SuccessComponent, {
            title:'Applied', 
            message:  MESSAGES['TXT01']
          }).subscribe(()=>{
            this.isRequesting=false;                      
            console.log("apply successfully completed",this.bkmrk.getCurrentBookmark());
          });
      }, err => {
        this.isRequesting=false;
        this.errorMsg = MESSAGES[err['code']]; 
      });
  }

  // goToUserSummary(){    
  //   console.log("Cannot Apply Dialog need to be provided.");
  //   console.log("before dialog get cokkie value:",this.auth.getUserId());
  //   if(this.auth.getUserId()){

  //     let disposable = this.dialogService.addDialog(ApplyComponent, {
  //           title:'Applying...', 
  //           message:  MESSAGES['TXT05']
  //         }).subscribe(()=>{
  //           console.log("go to summary page!!!!");
  //           this.router.navigate([this.auth.getRoute('usersummary')]);
  //         });
      
  //   }else{
  //        this.router.navigate(['/']);
  //      }
  // }

  goToUserSummary(){    
    this.usrSumm.setPopUp();
    this.router.navigate([this.auth.getRoute('usersummary')]);
  }


  addNewBookmark(){ 
    this.errorMsg = '';
    this.bookmarkBtn = true;
    this.bkmrk.bookmarkProperty(this.bkmrk.getCurrentBookmark())
     .subscribe(
       (result)=>{
        this.errorVar = false;
        this.bookmarkBtn = false;
        console.log("current bookmark =:",result);
        this.backBtn = true;
        this.bkmrk.setBookmarkList()
        .subscribe((r)=>{         
          console.log("This is add new bookmark function",this.backBtn);       
        });           
     },
     error=>{
       this.bookmarkBtn = false;
       this.errorVar = true;
       this.errorMsg = MESSAGES[error['code']]; 
       console.log("this.errorMsg:",this.errorMsg);     
       console.log("this.errorVar:",this.errorVar);     
     })
  }

  removeBookmark(msg){
    this.errorMsg = '';
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title:'Bookmark?', 
      message:  msg })
      .subscribe((isConfirmed)=>{
        //We get dialog result                    
        if(isConfirmed) {
          console.log("hello Delete button with bookmark id:",this.bkmrk.getCurrentBookmark().Bookmark_ID);
           this.bkmrk.removeBookmark(this.bkmrk.getCurrentBookmark().Bookmark_ID)
          .subscribe((response)=> { 
             this.bkmrk.setBookmarkList().subscribe(); 
             this.rmBookmark = true;
            console.log("Delete Bookmark msg:",response); 
            this.router.navigate(['user/bookmark']);         
            },
            (err) => {
              this.errorMsg = MESSAGES[err['code']]; 
              console.log(err);
            }
          )
        }else {
            console.log("you click cancel button");
        }
    });

  }

  gotoViewApplication(){

    this.router.navigate( [ this.auth.getRoute('apply')  + "/"  + this.bkmrk.getCurrentBookmark().Bookmark_ID ] );
  }

  gbf() {
    this.gbSrv.gbf();
  }

  checkIsArray(item){
    return Array.isArray(item);
  }

  mapResizeevent(){
    if(this.bkmrk.getImageArrayLength()){
      this.setLocation();
      console.log("resize funtion 1=>");
      if(this.locMap){
        console.log("resize funtion 2=>");
        google.maps.event.addListenerOnce(this.locMap, 'idle', function() {
          google.maps.event.trigger(this.locMap, 'resize');
        }); 
      }
    }
  }

  ngAfterViewInit(){
    
    console.log("this is slide function honme component1");
    this.mapResizeevent();

    console.log("this is slide function honme component2");
  }

  shareReportDialog(){
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title:'Share Report', 
      message:  MESSAGES.TXT20 })
      .subscribe((isConfirmed)=>{
        //We get dialog result                    
        if(isConfirmed) {
          console.log("you agreed to share");
          this.shareReport();
        }else {
          console.log("you click cancel button");
        }
    });
  }

  shareReport(){
    this.usrSumm.shareReport(this.bkmrk.getCurrentBookmark().Bookmark_ID)
    .subscribe((data)=>{
      console.log(data)
      this.applyBookmark();
    },(err)=>{
      console.log(err);
    })
  }

  gotoLeaseSummary(){
    console.log("here",this.bkmrk.getCurrentBookmark());
    // console.log("this.bkmAppSrv.getApplicationId:",this.bkmAppSrv.getApplicationId());
    // this.router.navigate( ["user/leaseSummary/"+this.bkmAppSrv.getApplicationId()] );
    //this.router.navigate( ["user/leaseSummary/"+this.bkmrk.getCurrentBookmark().Bookmark_ID] );
    this.router.navigate( ["user/leaseDocuments/"+this.bkmrk.getCurrentBookmark().Bookmark_ID] );
  }

  gotoPayments(){
    console.log('Payments');
    this.router.navigate( [ '/user/payment/' + this.bkmrk.getCurrentBookmark().Bookmark_ID ] );
  }

}
