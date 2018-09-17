import {  Component, OnInit,ViewChild ,ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService,FileService,ConfigService,EqualValidator,PasswordValidator,PhoneValidator,EmailValidator,GobackbuttonService} from '../common';
declare var google: any;
@Component({
  selector: 'app-register-address',
  templateUrl: './register-address.component.html',
  styleUrls: ['./register-address.component.css']
})
export class RegisterAddressComponent implements OnInit {

  addressModel:any={};
  AddressFrm:any;
  error='';
  constructor(
    private ref: ChangeDetectorRef,
    private frmbuilder : FormBuilder,
    private gbSrv         : GobackbuttonService,
  ) { 

    this.AddressFrm = frmbuilder.group({
                    'Address_1' : [null, Validators.required],
                    'Address_2':[null, Validators.required],                  
                    'Address_City' : [null, Validators.required],
                    'Address_State_Abbr' : [null, Validators.required],                    
                    'Address_ZipCode' : [null, Validators.required]                   
                  })

    this.AddressFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
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
    
  }

  getPlaceDetails(place: any){
     
          
      this.addressModel.Address_2 = '';
      this.addressModel.Address_City = '';
      this.addressModel.Address_State_Abbr = '';
      this.addressModel.Address_ZipCode = '';
      console.log("Place",place)
      if(place.address_components){
        for(let i = 0; i < place.address_components.length ; i++){
          console.log(place.address_components[i].types[0]);
          switch(place.address_components[i].types[0]){
            case 'street_number' :this.addressModel.Address_2=place.address_components[i].long_name+ ' ';break;
            case 'route':this.addressModel.Address_2=this.addressModel.Address_2+place.address_components[i].long_name;break;          
            case 'locality': {             
              if(this.addressModel.Address_City.length==0) this.addressModel.Address_City = place.address_components[i].long_name; 
              break;
            }          
            case 'administrative_area_level_2': {              
              if(this.addressModel.Address_City.length==0) this.addressModel.Address_City = place.address_components[i].long_name; 
              break;
            }
            case 'administrative_area_level_1': this.addressModel.Address_State_Abbr = place.address_components[i].short_name; break;
            case 'postal_code': this.addressModel.Address_ZipCode = place.address_components[i].short_name; break;
            default: break;
          }
        }
      }      
      
 }

 gbf() {
    this.gbSrv.gbf();
  }

  registerAddress(){
    console.log(this.addressModel)
  }

}
