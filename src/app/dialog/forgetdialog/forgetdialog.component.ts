import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CONSTANTS } from '../../app.constants';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgetdialog',
  templateUrl: './forgetdialog.component.html',
  styleUrls: ['./forgetdialog.component.css']
})
export class ForgetdialogComponent extends DialogComponent {

  @ViewChild('okButton') focusedElement: any;

  event: any;

  constructor(dialogService: DialogService) { super(dialogService); }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    if (this.focusedElement != undefined) {
      this.focusedElement.nativeElement.focus();
    }
    console.log("ngAfterViewInit - event");
    console.log(event);
    this.keyUp(event);
  }


  Close() {
    this.close();
  }

  confirm() {
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
