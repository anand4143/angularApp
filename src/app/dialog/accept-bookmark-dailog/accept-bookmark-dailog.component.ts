import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-accept-bookmark-dailog',
  templateUrl: './accept-bookmark-dailog.component.html',
  styleUrls: ['./accept-bookmark-dailog.component.css']
})
export class AcceptBookmarkDailogComponent extends DialogComponent {

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

 confirm() {
    this.result = true;
    this.close();
  }
 Close() {
    this.result = false;
    this.close();
  }

}
