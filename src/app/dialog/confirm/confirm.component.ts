import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent extends DialogComponent {
  isConfirm: boolean = true;

  @ViewChild('okButton') focusedElement: any

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
    this.keyUp(event);
  }

  confirm() {
    // on click on confirm button we set dialog result as true,
    // ten we can get dialog result from caller code
    this.result = true;
    this.close();
  }

  keyUp(event: any) {
    this.event = event;
    console.log("ESCclose");
    if (event && event.keyCode != undefined) {
      if (event.keyCode == 27) {
        console.log("event.keyCode", event.keyCode);
        this.close();
      }
    }
  }

}