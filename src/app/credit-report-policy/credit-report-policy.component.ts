import { Component, OnInit } from '@angular/core';
import { GobackbuttonService } from '../common';

@Component({
  selector: 'app-credit-report-policy',
  templateUrl: './credit-report-policy.component.html',
  styleUrls: ['./credit-report-policy.component.css']
})
export class CreditReportPolicyComponent implements OnInit {

  constructor(
    private gbSrv : GobackbuttonService
  ) { }

  ngOnInit() {
  }

  gbf() {
    this.gbSrv.gbf();
  } 

}
