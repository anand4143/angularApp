import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, EqualValidator, PasswordValidator, PhoneValidator, EmailValidator, GobackbuttonService, PhonenumberPipe, ConfigService, BookmarkApplicationService } from '../common';
import { BookmarkService } from '../bookmark/bookmark.service';
// import { MyDatePickerModule } from 'mydatepicker';
import { UserSummaryService } from '../user-summary';
import { MESSAGES } from '../app.messages';
import { RegisterUserService } from '../register-user';
import { RegisterSsnService } from '../register-ssn/register-ssn.service';
import { DialogService } from "ng2-bootstrap-modal";
import { SuccessComponent } from '../dialog/success/success.component';
import { TcComponent } from '../dialog/tc/tc.component';
import { DatePipe } from '@angular/common';
declare var google: any;

@Component({
  selector: 'app-register-new',
  templateUrl: './register-new.component.html',
  styleUrls: ['./register-new.component.css'],
  providers: [DatePipe],
})
export class RegisterNewComponent implements OnInit {
  termsconditionsVar: boolean = false;
  showSSN: boolean = false;
  rgNewFrm: FormGroup;
  vmsg: string = '';
  rgNewMdl: any = {};
  error = '';
  errorMessage: string = '';
  errorType: string = '';
  // myDatePickerOptions = { showTodayBtn: true, dateFormat: 'mm/dd/yyyy' };
  messages = MESSAGES;
  // selBirthday: any = {};

  constructor(
    private bookmarkApplicationService: BookmarkApplicationService,
    private bookmarkService: BookmarkService,
    private dialogService: DialogService,
    private router: Router,
    private auth: AuthService,
    private rgssnSrv: RegisterSsnService,
    private config: ConfigService,
    private frmbuilder: FormBuilder,
    private rgSrv: RegisterUserService,
    private gbSrv: GobackbuttonService,
    private usrSrv: UserSummaryService,
    private ref: ChangeDetectorRef,
    private _datePipe:DatePipe
  ) {
    this.rgNewFrm = frmbuilder.group({
      'User_First_Name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
      'User_Last_Name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(32)])],
      'Email.Email_Address': [null, Validators.required],
      'Contact.Contact_Num': [null, Validators.compose([Validators.required, Validators.maxLength(12)])],
      // 'User_Password'           : [null, Validators.required],
      // 'confirmpassword'         : [null, Validators.required],
      // 'Gender'                  : [null,Validators.required],
      'captcha': [null, Validators.required],
      'termscondition': [null, Validators.required],
      'Address_2': [null, Validators.required],
      'Address_City': [null, Validators.required],
      'Address_State_Abbr': [null, Validators.required],
      'Address_ZipCode': [null, Validators.compose([Validators.required, Validators.maxLength(7)])],
      'User_SSN': [null, Validators.compose([Validators.required,Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}')])],
      'User_DOB': [null, Validators.required]
      //'User_DOB': [null, Validators.compose([Validators.required, Validators.maxLength(4)])]
    })
    this.rgNewFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    console.log("ng it this.rgNewMdl:", this.rgNewMdl);
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



  onFromDateChanged(event: any) {
  
    this.rgNewMdl.User_DOB = event.formatted;
    // this.rgNewMdl['User_DOB'] = event.formatted;
    this.rgNewFrm.controls['User_DOB'].setValue(event.formatted);
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  registerUsers() {
    this.errorType = '';
    this.errorMessage = '';
    this.bookmarkService.resetAll();
    this.bookmarkApplicationService.resetAll();
    let userObj = {};
    userObj = {
      'Contact.Contact_Num' : this.rgNewMdl['Contact.Contact_Num'],
      'Email.Email_Address' : this.rgNewMdl['Email.Email_Address'],
      'User_First_Name'     : this.rgNewMdl['User_First_Name'],
      'User_Last_Name'      : this.rgNewMdl['User_Last_Name'],
      'User_SSN'            : this.rgNewMdl['User_SSN'],
      'User_DOB'            : this._datePipe.transform(this.rgNewMdl['User_DOB'], 'MM/dd/yyyy'),
      'Address_2'           : this.rgNewMdl['Address_2'],
      'Address_1'           : this.rgNewMdl['Address_1'],
      'Address_City'        : this.rgNewMdl['Address_City'],
      'Address_State_Abbr'  : this.rgNewMdl['Address_State_Abbr'],
      'Address_ZipCode'     : this.rgNewMdl['Address_ZipCode'],
      'Address_Country_Abbr':this.rgNewMdl.Address_Country_Abbr
      // 'User_Gender'         : this.rgNewMdl['User_Gender']
      // 'User_Password'       : this.rgNewMdl['User_Password']
     
    }
    
    this.rgSrv.registerUser(userObj)
      .subscribe(
      dt => {
        console.log("Inside success", dt);
        this.termsconditionsVar = true;
        let msg = MESSAGES['TXT07'];
        let disposable = this.dialogService.addDialog(SuccessComponent, {
          title: MESSAGES['HDR01'],
          message: msg
        })
          .subscribe((res) => {

            console.log("I have closed the dialog...", res)
            this.router.navigate(['/']);
            console.log("Yes..I have closed the dialog...")
          });
      },
      err => {
        console.log("err:", err);
        this.errorType = err.msg;
        this.errorMessage = MESSAGES[err.code];
        console.log("errorType;",this.errorType);
        console.log("hehheheheh;",this.errorMessage);
      }
      )
  }

  disableSubmitBtn() {
    if ((this.rgNewMdl['termscondition'] == undefined) || (this.rgNewMdl['termscondition'] == false)) {
      this.termsconditionsVar = false;

    } else if (this.rgNewMdl['termscondition'] == true) {
      this.termsconditionsVar = true;
    }
  }

  gbf() {
    this.router.navigate(['']);
  }

  getPlaceDetails(place: any) {
    this.rgNewMdl.Address_2 = '';
    this.rgNewMdl.Address_City = '';
    this.rgNewMdl.Address_State_Abbr = '';
    this.rgNewMdl.Address_ZipCode = '';
    this.rgNewMdl.Address_Country_Abbr = '';
    console.log("Place", place)
    if (place.address_components) {
      for (let i = 0; i < place.address_components.length; i++) {
        console.log(place.address_components[i].types[0]);
        switch (place.address_components[i].types[0]) {
          case 'street_number': this.rgNewMdl.Address_2 = place.address_components[i].long_name + ' '; break;
          case 'route': this.rgNewMdl.Address_2 = this.rgNewMdl.Address_2 + place.address_components[i].long_name; break;
          // case 'locality': {
          //   if (this.rgNewMdl.Address_City.length == 0) this.rgNewMdl.Address_City = place.address_components[i].long_name;
          //   break;
          // }
          case 'administrative_area_level_2': {
            if (this.rgNewMdl.Address_City.length == 0) this.rgNewMdl.Address_City = place.address_components[i].long_name;
            break;
          }
          case 'administrative_area_level_1': this.rgNewMdl.Address_State_Abbr = place.address_components[i].short_name; break;
          case 'postal_code': this.rgNewMdl.Address_ZipCode = place.address_components[i].short_name; break;
          case 'country': this.rgNewMdl.Address_Country_Abbr = place.address_components[i].short_name; break;
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
    if(this.rgNewFrm.controls['User_DOB'].touched && this.rgNewFrm.controls['User_DOB'].hasError('required')){
      event.srcElement.type='text';
    }    
  }
  tc(){
    let disposable = this.dialogService.addDialog(TcComponent, {
          title: 'Terms & Condition',
          message: ""
        })
          .subscribe((res) => {

            console.log("I have closed the tc...", res)
            console.log("Yes..I have closed the tc dialog...")
          });
  }
      
 }
