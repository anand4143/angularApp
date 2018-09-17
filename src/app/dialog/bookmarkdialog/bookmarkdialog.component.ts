import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-bookmarkdialog',
  templateUrl: './bookmarkdialog.component.html',
  styleUrls: ['./bookmarkdialog.component.css']
})
export class BookmarkdialogComponent extends DialogComponent {

  @ViewChild('okButton') focusedElement: any;

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
