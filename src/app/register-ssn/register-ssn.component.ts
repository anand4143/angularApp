import {  Component, OnInit,ViewChild,ChangeDetectorRef } from '@angular/core';
import {  FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {  Router } from '@angular/router';
import {  AuthService,EqualValidator,PasswordValidator,PhoneValidator,EmailValidator,GobackbuttonService,SsnPipe  } from '../common';
import {  RegisterSsnService } from './register-ssn.service';
import {  RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
import {  MESSAGES } from '../app.messages';
import {  DialogComponent, DialogService } from "ng2-bootstrap-modal";
import {  UserSummaryService  } from '../user-summary';
import {  RegisterUserService } from '../register-user';
import {  MyDatePickerModule } from 'mydatepicker';
declare var google: any;

@Component({
  selector: 'app-register-ssn',
  templateUrl: './register-ssn.component.html',
  styleUrls: ['./register-ssn.component.css'],
  providers: [SsnPipe],
})
export class RegisterSsnComponent implements OnInit {

   rgssnMdl             : any =  { };
   error                =  '';
   rgssnFrm             : FormGroup;
   vmsg                 : string  = ''; 
   selBirthday          : any = { }
   myDatePickerOptions  = {showTodayBtn:true,dateFormat:'mm/dd/yyyy'};
   private placeholder  : string = 'BIRTHDAY';


    constructor(  private router        : Router, 
                  private auth          : AuthService, 
                  private frmbuilder    : FormBuilder, 
                  private ref           : ChangeDetectorRef,                
                  private rgssnSrv      : RegisterSsnService,
                  private rgUsrSrv      : RegisterUserService,
                  private gbSrv         : GobackbuttonService,
                  private usrSrv        : UserSummaryService,
                  private dialogService : DialogService,
                ){
                  this.rgssnFrm = frmbuilder.group({

                    'Address_1' : [null, Validators.required],
                    'Address_2':[null, Validators.required],                  
                    'Address_City' : [null, Validators.required],
                    'Address_State_Abbr' : [null, Validators.required],  
                    // 'Address_Country' : [null, Validators.required],                   
                    //'Address_ZipCode' : [null, Validators.required] ,
                    'Address_ZipCode' : [null, Validators.compose([Validators.required, Validators.maxLength(7)])] ,
                    'User_SSN' : [null, Validators.required],
                    'User_DOB' : [null, Validators.required],                                  

                  })
                  this.rgssnFrm.valueChanges.subscribe(data => this.error = '');
                }

  ngOnInit() { 
    this.usrSrv.resetProgress();
    let searchBox: any = document.getElementById('search-box');
    let options = {
      types: [
        // return only geocoding results, rather than business results.
        'geocode',
      ]
    };
    var autocomplete = new google.maps.places.Autocomplete(searchBox, options);
    // Add listener to the place changed event
    autocomplete.addListener('place_changed', () => {
      this.getPlaceDetails(autocomplete.getPlace());
      this.ref.detectChanges();
    });

    if(this.auth.isLoggedIn()){
     this.rgssnSrv.getUserSsnData()
      .subscribe((user)=>{
         this.rgssnMdl    = user;
         this.selBirthday = user.User_DOB;
         this.rgssnFrm.controls['User_DOB'].setValue(user.User_DOB);
         console.log("ssn model:",this.rgssnMdl);
      })
    }
  }
  changePlaceholder() {
    this.placeholder = 'BIRTHDAY';
  }

  onFromDateChanged(event:any){    
    this.rgssnMdl.User_DOB  = event.formatted;
    this.rgssnFrm.controls['User_DOB'].setValue(event.formatted);            
  }

  saveSsnData(){
    if(this.auth.isLoggedIn()){
      if(!this.rgssnMdl.Address_Country_Abbr) this.rgssnMdl.Address_Country_Abbr = 'US'; 
      this.rgssnSrv.saveSsnData(this.rgssnMdl)
      .subscribe(
          (user)  => {
            this.usrSrv.setStatusToComp('SSN');
            let disposable =  this.dialogService.addDialog(RegisterDialogComponent, {
                              title:  this.auth.getName(), 
                              message:  MESSAGES['TXT22']
                              })
                              .subscribe((confirm)=>{
                                console.log("Inside register ssn");                    
                                this.router.navigate([this.auth.getRoute('usersummary')]);
                              },
                              (close) => {
                                console.log("you click close");
                              });
          },      
          err => {
            console.log("registerUser error:",err);
        });
    } else {
      this.rgUsrSrv.registerUser(this.rgssnMdl)
      .subscribe(
        user  => {
          //console.log("ssn componet Line 40",user);
          this.usrSrv.setStatusToComp('SSN');
          this.router.navigate(['/user/home']);
        },      
        err   => {
          // var msgCode       = JSON.parse(err._body);
          // var receivedmsg   = '';
          // MESSAGES.forEach(function(msg){
          //   if(msgCode.errCd===msg.errCd){             
          //     receivedmsg  = msg.message;           
          //   }
          // })
          // this.vmsg        = receivedmsg;
        })
    }
  }

   gbf() {
    this.gbSrv.gbf();
  }  

  getPlaceDetails(place: any){     
      this.rgssnMdl.Address_2 = '';
      this.rgssnMdl.Address_City = '';
      this.rgssnMdl.Address_State_Abbr = '';
      this.rgssnMdl.Address_ZipCode = '';
      this.rgssnMdl.Address_Country_Abbr = '';
      console.log("Place",place)
      if(place.address_components){
        for(let i = 0; i < place.address_components.length ; i++){
          console.log(place.address_components[i].types[0]);
          switch(place.address_components[i].types[0]){
            case 'street_number' :this.rgssnMdl.Address_2=place.address_components[i].long_name+ ' ';break;
            case 'route':this.rgssnMdl.Address_2=this.rgssnMdl.Address_2+place.address_components[i].long_name;break;          
            case 'locality': {             
              if(this.rgssnMdl.Address_City.length==0) this.rgssnMdl.Address_City = place.address_components[i].long_name; 
              break;
            }          
            case 'administrative_area_level_2': {              
              if(this.rgssnMdl.Address_City.length==0) this.rgssnMdl.Address_City = place.address_components[i].long_name; 
              break;
            }
            case 'administrative_area_level_1': this.rgssnMdl.Address_State_Abbr = place.address_components[i].short_name; break;
            case 'postal_code': this.rgssnMdl.Address_ZipCode = place.address_components[i].short_name; break;
            case 'country': this.rgssnMdl.Address_Country_Abbr = place.address_components[i].short_name; break;
            default: break;
          }
        }
      }      
      
 }

}
