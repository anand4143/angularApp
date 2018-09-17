import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";


@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent extends DialogComponent {

  answer = '';

  @ViewChild('closeButton') focusedElement: any;

  event: any;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    if (this.focusedElement != undefined) {
      this.focusedElement.nativeElement.focus();
    }
    console.log("ngAfterViewInit - event");
    console.log(event);
    if (event != undefined) {
      this.keyUp(event);
    }
  }


  byebye() {
    this.result = true;
    this.close();
  }


  sendAns(ans) {
    this.result = ans;
    this.close();
  }

  keyUp(event: any) {
    this.event = event;
    console.log("ESCclose");
    if (event.keyCode != undefined) {
      if (event.keyCode == 27) {
        console.log("event.keyCode", event.keyCode);
        this.byebye();
      }
    }
  }
}
