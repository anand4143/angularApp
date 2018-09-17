import { Component,  ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-tc',
  templateUrl: './tc.component.html',
  styleUrls: ['./tc.component.css']
})
export class TcComponent extends DialogComponent {
 @ViewChild('okButton') focusedElement: any;
 event: any;

  constructor(dialogService: DialogService) { 
     super(dialogService);

  }
 gbf() {
    this.result = false;
    this.close();
  }

  Close() {
    this.result = false;
    this.close();
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



  confirm() {
     this.result = true;
    this.close();
  }

 

}
