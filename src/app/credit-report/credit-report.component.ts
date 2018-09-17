import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService, GobackbuttonService } from '../common';
import { RegisterCreditService } from '../register-credit/register-credit.service';

@Component({
  selector: 'app-credit-report',
  templateUrl: './credit-report.component.html',
  styleUrls: ['./credit-report.component.css']
})
export class CreditReportComponent implements OnInit {
  reportDate = '';
  helpAddress = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private regCredService: RegisterCreditService,
    private gbSrv: GobackbuttonService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.regCredService.getReport(params['renterId'])
        .subscribe((data) => {
          this.reportDate = data['CreditProfile']['Header']['ReportDate'];
          this.helpAddress = data['CreditProfile']['ConsumerAssistanceReferralAddress'];
        },
        (err) => {
          console.log(err);
        });
    });
  }

  isEmpty(array) {
    if (array) {
      if (array.length) return true;
      else false
    }
  }

  gbf() {
    this.gbSrv.gbf();
  }

}
