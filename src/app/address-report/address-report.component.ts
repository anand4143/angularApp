import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService, GobackbuttonService } from '../common';
import { AddressCheckService } from '../address-check/address-check.service';

@Component({
  selector: 'app-address-report',
  templateUrl: './address-report.component.html',
  styleUrls: ['./address-report.component.css']
})
export class AddressReportComponent implements OnInit {
  error='';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private gbSrv: GobackbuttonService,
    private addressService: AddressCheckService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log('renterId',params['renterId'])
      this.addressService.getReport('ssn',params['renterId'])
        .subscribe((data) => {
          // console.log('data', data);
          // this.addressReport = data;
          // console.log('data1', data.result);
          // console.log('address',  this.addressReport.result);
        },
        (err) => {
          console.log(err);
          this.error='Report expired'
        });
    });
  }


  gbf() {
    this.gbSrv.gbf();
  }
}