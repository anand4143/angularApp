import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, EqualValidator, PasswordValidator, PhoneValidator, EmailValidator, GobackbuttonService, PhonenumberPipe, ConfigService } from '../common';
import { UserSummaryService } from '../user-summary';
import { RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
import { MESSAGES } from '../app.messages';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { DatePipe } from '@angular/common';
import { RegisterUserService } from './register-user.service';

declare var google: any;

@Component({
  selector: 'app-register-user',
  providers: [DatePipe,PhonenumberPipe],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  rgMdl: any = {};
  rgData: any = {};
  error = '';
  rgFrm: FormGroup;
  vmsg: string = '';
  errorMessage: string = '';
  errorType: string = '';
  // selBirthday: any = {};
  // myDatePickerOptions = { showTodayBtn: true, dateFormat: 'mm/dd/yyyy' };

  constructor(private router: Router,
    private auth: AuthService,
    private config: ConfigService,
    private frmbuilder: FormBuilder,
    private rgSrv: RegisterUserService,
    private gbSrv: GobackbuttonService,
    private usrSrv: UserSummaryService,
    private dialogService: DialogService,
    private ref: ChangeDetectorRef,
    private _datePipe:DatePipe
  ) {

    if (this.auth.isLoggedIn()) this.rgFrm = frmbuilder.group({
      'User_First_Name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
      'User_Last_Name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
      'Email.Email_Address': [null, Validators.required],
      // 'Gender'                  : [null,Validators.required],
      'Contact.Contact_Num': [null, Validators.compose([Validators.required, Validators.maxLength(12)])],
      // 'Address_1': [null, Validators.required],
      'Address_2': [null, Validators.required],
      'Address_City': [null, Validators.required],
      'Address_State_Abbr': [null, Validators.required],
      'Address_ZipCode': [null, Validators.compose([Validators.required, Validators.maxLength(7)])],
      'User_SSN': [null,  Validators.compose([Validators.required,Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}')])],
      'User_DOB': [null, Validators.required]
    })
    // else this.rgFrm = frmbuilder.group({
    //   'User_First_Name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
    //   'User_Last_Name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
    //   'Email.Email_Address': [null, Validators.required],
    //   'Contact.Contact_Num': [null, Validators.compose([Validators.required, Validators.maxLength(12)])],
    //   'User_Password': [null, Validators.required],
    //   // 'Gender'                  : [null,Validators.required],
    //   'confirmpassword': [null, Validators.required],
    //   'captcha': [null, Validators.required]

    // })

    this.rgFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.usrSrv.resetProgress();

    // let searchBox: any = document.getElementById('search-box');
    // let options = {
    //   types: [
    //     // return only geocoding results, rather than business results.
    //     'geocode',
    //   ]
    // };
    // var autocomplete = new google.maps.places.Autocomplete(searchBox, options);
    // console.log('searchBox', searchBox);
    // // Add listener to the place changed event
    // autocomplete.addListener('place_changed', () => {
    //   this.getPlaceDetails(autocomplete.getPlace());
    //   this.ref.detectChanges();
    // });

    if (this.auth.isLoggedIn()) {
      console.log("Logged In: Register User");
      this.rgSrv.getUserData()
        .subscribe((user) => {
          console.log("user", user);
           this.rgMdl = user;
          // this.rgMdl = user.User_ID;
          // this.rgMdl = user.User_First_Name;
          // this.rgMdl = user.User_Last_Name;
          // this.rgMdl = user.Email.Email_Address;
          // this.rgMdl = user.User_SSN;
          // this.rgMdl = user.Address_1;
          // this.rgMdl = user.Address_2;
          // this.rgMdl = user.Address_City;
          // this.rgMdl = user.Address_State_Abbr;
          // this.rgMdl = user.Address_ZipCode;
          // this.rgMdl = user.Address_Country_Abbr;
          // this.rgMdl = user.Contact.Contact_Num;
         // this.selBirthday = user.User_DOB;
          //this.rgFrm.controls['User_DOB'].setValue(user.User_DOB);
          console.log("ssn model:", this.rgMdl);
          //var startDate = (new Date(user.User_DOB) > new Date()) ? new Date(user.User_DOB):new Date(); 
          this.rgMdl['User_DOB'] = this._datePipe.transform(user.User_DOB, 'yyyy-MM-dd');
        })
    }
  }

  ngAfterViewInit() {
    console.log('searchBox 1');
    let searchBox: any = document.getElementById('search-box');
    let options = {
      types: [
        // return only geocoding results, rather than business results.
        'geocode',
      ]
    };
    var autocomplete = new google.maps.places.Autocomplete(searchBox, options);
    console.log('searchBox', searchBox);
    // Add listener to the place changed event
    autocomplete.addListener('place_changed', () => {
      this.getPlaceDetails(autocomplete.getPlace());
      this.ref.detectChanges();
    });
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  onFromDateChanged(event: any) {
    this.rgMdl.User_DOB = event.formatted;
    this.rgFrm.controls['User_DOB'].setValue(event.formatted);
  }


  registerUser() {
    // console.log("rgmdl", this.rgMdl);
    // let userObj = {};
    // userObj = {
    //   'Contact.Contact_Num': this.rgMdl['Contact.Contact_Num'],
    //   'Email.Email_Address': this.rgMdl['Email.Email_Address'],
    //   'User_First_Name': this.rgMdl['User_First_Name'],
    //   'User_Last_Name': this.rgMdl['User_Last_Name'],
    //   'User_SSN': this.rgMdl['User_SSN'],
    //   'User_DOB': this.rgMdl['User_DOB'],
    //   'Address_2': this.rgMdl['Address_2'],
    //   'Address_1': this.rgMdl['Address_1'],
    //   'Address_City': this.rgMdl['Address_City'],
    //   'Address_State_Abbr': this.rgMdl['Address_State_Abbr'],
    //   'Address_ZipCode': this.rgMdl['Address_ZipCode'],
    //   'Address_Country_Abbr':this.rgMdl.Address_Country_Abbr
    // }
    this.rgMdl['User_DOB'] = this._datePipe.transform(this.rgMdl['User_DOB'], 'MM/dd/yyyy'),

    this.rgSrv.updateUser(this.rgMdl)
    // this.rgSrv.updateUser(userObj)
    .subscribe((user) => {
      console.log("Success==> ", this.rgMdl);
      this.usrSrv.setStatusToComp('PER');
      //this.router.navigate([this.auth.getRoute('register-ssn')]);
      let disposable = this.dialogService.addDialog(RegisterDialogComponent, {
        title: this.auth.getName(),
        message: MESSAGES['TXT22']
      })
        .subscribe((confirm) => {
          this.router.navigate([this.auth.getRoute('usersummary')]);
        },
        (close) => {
          console.log("you click close");
        });
    },
    (err) => {
      console.log("registerUser error:", err);
        this.errorType = err.msg;
        this.errorMessage = MESSAGES[err.code];

    })
    
  }

  changePassword() {
    console.log("changePassword");
    this.router.navigate([this.auth.getRoute('password/change')]);
  }

  gbf() {
    // this.router.navigate([this.auth.getRoute('usersummary')]);
    this.gbSrv.gbf();
  }

  getPlaceDetails(place: any) {
    this.rgMdl.Address_2 = '';
    this.rgMdl.Address_City = '';
    this.rgMdl.Address_State_Abbr = '';
    this.rgMdl.Address_ZipCode = '';
    this.rgMdl.Address_Country_Abbr = '';
    console.log("Place", place)
    if (place.address_components) {
      for (let i = 0; i < place.address_components.length; i++) {
        console.log(place.address_components[i].types[0],this.rgMdl.Address_2);
        switch (place.address_components[i].types[0]) {          
          case 'street_number': this.rgMdl.Address_2 = place.address_components[i].long_name + ' '; break;
          case 'route': this.rgMdl.Address_2 = this.rgMdl.Address_2 + place.address_components[i].long_name; break;
          // case 'locality': {
          //   if (this.rgMdl.Address_City.length == 0) this.rgMdl.Address_City = place.address_components[i].long_name;
          //   break;
          // }
          case 'administrative_area_level_2': {
            if (this.rgMdl.Address_City.length == 0) this.rgMdl.Address_City = place.address_components[i].long_name;
            break;
          }
          case 'administrative_area_level_1': this.rgMdl.Address_State_Abbr = place.address_components[i].short_name; break;
          case 'postal_code': this.rgMdl.Address_ZipCode = place.address_components[i].short_name; break;
          case 'country': this.rgMdl.Address_Country_Abbr = place.address_components[i].short_name; break;
          default: break;
        }
      }
    }

  }

  focusFunction(event){
    console.log('Focused',event.srcElement.type)
    event.srcElement.type='date';
  }

  outFocusFunction(event){
    console.log('Out focused',event.srcElement.type);    
    if(this.rgFrm.controls['User_DOB'].touched && this.rgFrm.controls['User_DOB'].hasError('required')){
      event.srcElement.type='text';
    }    
  }

  display(){
    console.log('User_SSN',this.rgFrm.controls['User_SSN']);
  } 
}
