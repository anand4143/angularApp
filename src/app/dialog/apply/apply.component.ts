import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent extends DialogComponent {

  @ViewChild('okButton') focusedElement: any;

  event: any;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  //  Close(){   
  //       this.close();
  //   }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    if (this.focusedElement != undefined) {
      this.focusedElement.nativeElement.focus();
    }
    console.log(event);
    this.keyUp(event);
  }



  confirm() {
    // on click on confirm button we set dialog result as true,
    // ten we can get dialog result from caller code

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
  }

}
