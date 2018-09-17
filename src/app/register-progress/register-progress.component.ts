import { Component, OnInit } from '@angular/core';
import { UserSummaryService } from '../user-summary/user-summary.service';
import { ActivatedRoute }  from '@angular/router';
import { AuthService } from '../common';

@Component({
  selector: 'app-register-progress',
  templateUrl: './register-progress.component.html',
  styleUrls: ['./register-progress.component.css']
})
export class RegisterProgressComponent implements OnInit {  
  constructor(
    private userInfo:UserSummaryService,
    private route:ActivatedRoute,
    private auth: AuthService
  ) { 
    
  }

  ngOnInit() {   
      console.log("Inside Register Progress");            
  }

  checkRoute(type){
    if( type == 'address' || type == 'background' ){
      type = type + '-check';
    }
    else{
       type = 'register-' + type;
    }   
    return this.route.routeConfig.path.includes(type);
  }

  isComplete(type){
    return this.userInfo.isComplete(type);
  }

  isSkipped(curRoute, type){
    if( type == 'address' || type == 'background' ){
      curRoute = curRoute + '-check';
    }
    curRoute = 'register-' + curRoute;
    return !this.route.routeConfig.path.includes(curRoute) && this.userInfo.isSkipped(type);
  }

  
}
