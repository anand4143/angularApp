import { Component, OnInit } from '@angular/core';
import { AuthService , GobackbuttonService} from '../common';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-landlord-document',
  templateUrl: './landlord-document.component.html',
  styleUrls: ['./landlord-document.component.css']
})
export class LandlordDocumentComponent implements OnInit {

  constructor(
    private router        : Router,    
    private route         : ActivatedRoute,   
    private auth          : AuthService,
    private gbSrv         : GobackbuttonService,
  ) { }

  ngOnInit() {
  }

  goToPayments(){
    this.router.navigate(['landlord/contract/' + this.route.snapshot.params['bkmrkId']])
  }

  gbf() {
    this.gbSrv.gbf();
  }
}
