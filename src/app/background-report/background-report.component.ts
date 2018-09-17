import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService, GobackbuttonService } from '../common';
import { BackgroundCheckService } from '../background-check/background-check.service';
@Component({
  selector: 'app-background-report',
  templateUrl: './background-report.component.html',
  styleUrls: ['./background-report.component.css']
})
export class BackgroundReportComponent implements OnInit {
  report:any={};
  candidate:any={};
  jobLocation:any={};
  convictions:any=[];
  constructor(
    private router : Router,
    private route :  ActivatedRoute,
    private auth : AuthService,             
    private bgCheckService : BackgroundCheckService,
    private gbSrv : GobackbuttonService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getOrderStatus(params['renterId']);      
    });
    
  }


   isEmpty(array){
      if(array){
        if(array.length) return true;
        else false
      }    
    }

    gbf() {
      this.gbSrv.gbf();
    }

    getOrderStatus(renterId){
      this.bgCheckService.getOrder(renterId)
      .subscribe((data)=>{
        console.log(data);
        this.report=data;
        this.candidate=data['candidate'];
        this.jobLocation=data['jobLocation'];
        this.convictions=data['candidate']['convictions'];
      },(err)=>{
        console.log(err);
      })
    }
}
