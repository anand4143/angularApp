import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { BookmarkApplicationService } from '../../common';
import { Router } from '@angular/router';
import { MESSAGES } from '../../app.messages';
@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css']
})
export class ReleaseComponent extends DialogComponent {

  @ViewChild('focused') focusedElement: any;
  releaseBtn            : boolean = true;
  applicantName         : string = '';   
  messages = MESSAGES; 
  errorMsg : boolean = false;
  //mymodel         : string = '';
  event: any;
  renterName: string = '';

  constructor(
    private router: Router,
    private bkmrkAppSrv: BookmarkApplicationService,
    dialogService: DialogService,

  ) {
    super(dialogService);
    this.applicantName = bkmrkAppSrv.getRenterInfo().name;
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    if (this.focusedElement != undefined) {
      this.focusedElement.nativeElement.focus();
    }
    console.log("ngAfterViewInit - event");
    console.log(event);
    this.keyUp(event);
  }

  releaseApplication() {
    console.log("you press release button");
    this.bkmrkAppSrv.releaseApplication(this.bkmrkAppSrv.getCurentApplication())
      .subscribe(
      (res) => {
        console.log("Completed Release....");
        this.Close();
        this.router.navigate(['broker/home']);
      }
      );
  }
  rejectApplication() {
    console.log("you press reject button");
  }

  Close() {
    this.result = false;
    this.close();
  }

  keyUp(event: any) {
    this.event = event;
    console.log("ESCclose");
    if (event.keyCode != undefined) {
      if (event.keyCode == 27) {
        console.log("event.keyCode", event.keyCode);
        this.close();
      }
    }
    console.log("event.keyCode",event.keyCode);
     if (event.keyCode == 8) {
       if((event.target.value) && (event.target.value.toUpperCase().trim() == this.renterName.trim())){
         console.log("inside if  this.errorMsg", this.errorMsg);
          this.releaseBtn = false;
          this.errorMsg = false;
       }else{
           this.releaseBtn = true;
           this.errorMsg = true;
       }
      }
  }


  checkInputVal(inputVal,event : any){
    //this.mymodel = userVal;
    console.log("event:",event);
    console.log("eventvalue:",event.target.value);
     if(this.applicantName.toUpperCase().trim() === (inputVal.toUpperCase().trim() + event.key.toUpperCase().trim()) ){
       this.releaseBtn = false;
       this.errorMsg = true;
       this.renterName = (inputVal.toUpperCase().trim() + event.key.toUpperCase());
      console.log("userVal inside",(inputVal.toUpperCase().trim() + event.key.toUpperCase()));
     }else{
       this.releaseBtn = true;
       this.errorMsg = true;
       console.log("userVal else",(inputVal.toUpperCase().trim() + event.key.toUpperCase()));
     }
  }

}
