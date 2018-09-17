import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent extends DialogComponent {

   constructor(dialogService: DialogService) { super(dialogService); }

  confirm() {
    this.result = true;
    this.close();
  }
 Close() {
    this.result = false;
    this.close();
  }
}
