import { Component, OnInit ,ViewChild, ChangeDetectorRef} from '@angular/core';
import { BookmarkService } from './bookmark.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
//import { SpinnerComponent } from '../spinner/spinner.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import * as _ from 'underscore';
import { AuthService,PagerService } from '../common';
import { Router } from '@angular/router';
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';

declare var google: any;  

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {
  selectedProp  : any = null;
  isRequesting  : boolean=false;
  latitute      : any;
  longitude     : any;
  model         : any = {};
  bookmarkForm  : FormGroup;
  error         : string;
  pager         : any = {};
  pageNum       : number = 1;
  constants     = CONSTANTS;
  msg           = MESSAGES;
  noResult      : boolean = false; 
  searchError   : boolean; 
  noBookmarkError   : boolean = false; 
  //bookmarkBtn: boolean = false;
  
  @ViewChild(SidebarComponent)
  sidebar:SidebarComponent

  constructor(
    private bookmarkService : BookmarkService,
    private fb              : FormBuilder,
    private ref             : ChangeDetectorRef,
    private pagerService    : PagerService,
    private auth            : AuthService,
    private router          : Router,
    
  ) { 
      this.bookmarkForm = fb.group({
             // To add a validator, we must first convert the string value into an array.
             //The first item in the array is the default value if any, then the next item in the array is the validator.
             //Here we are adding a required validator meaning that the firstName attribute must have a value in it.
             'locality' : [null],
             'city' : [null],
             'state' : [null],
             'zip' : [null] ,
             'aptnumber':[null]             
      });
      this.bookmarkForm.valueChanges.subscribe(data => this.error = '');
      this.pager.pages = [];
    }

  ngOnInit() {
  
    this.bookmarkService.resetCurrentBookmark();
    
    
    this.model = this.bookmarkService.getpropertySearchQuery();
    console.log("this.model: ",this.model);
    if(this.model){
      this.longitude = this.model.longitude;
      this.latitute = this.model.latitute;
    }

    if(!this.model.longitude && !this.model.latitute){
      ////console.log("this.model.longitude:",this.model.longitude);
      ////console.log("this.model.latitute:",this.model.latitute);
      this.bookmarkService.setpropertySearchQuery({aptnumber : '',city :'',locality : '',state : '',zipCode : '' }); 
    }else{
      ////console.log("this.model.longitude else:",this.model.longitude);
      ////console.log("this.model.latitute else:",this.model.latitute);
    }

    this.pageNum = this.bookmarkService.getpropertyRunPage();
    this.pager = this.pagerService.getPager(this.bookmarkService.getpropertyTotCount(), this.pageNum);

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

  findListing(){
    this.noResult = false;  
    this.searchError=false;  
    this.bookmarkService.resetNestIOCurpage();
    this.pageNum = 1;
    this.getProperties(1);    
  }

  setPage(page: number) {
    ////console.log("Set Page Start: ", this.pager);
    if(page == this.pager.currentPage) return;
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    this.pageNum = page;
    this.pager = this.pagerService.getPager(this.bookmarkService.getpropertyTotCount(), page);
    ////console.log("Set Page End: ", this.pager);
    this.getProperties(page);
  }

  getProperties(pageNum){
    this.model.latitute = this.latitute;
    this.model.longitude = this.longitude;
    this.bookmarkService.setpropertySearchQuery(this.model);
    if(!this.bookmarkService.isNestIOCurpage(pageNum-1)){
      this.isRequesting = true;      
      this.bookmarkService.getNestIOProperties(pageNum-1, this.latitute, this.longitude, this.model.locality, this.model.aptnumber)
      .subscribe((propCnt) => {          
        this.pager = this.pagerService.getPager(propCnt, this.pageNum);
        this.isRequesting = false;
        if(propCnt==0) this.noResult = true;
      },
      (err)=>{
        ////console.log("NestIO error",err);        
        this.searchError=true;
        this.isRequesting=false;        
      });
    }
  }

  markSelect(property){
    console.log("Inside mark select",property);
    this.addToHistory(property);
    ////console.log("property markSelect function::",property.id);
    var tmpBookmark = {};
    tmpBookmark['Property_JSON'] = property;
    tmpBookmark['Source_ID'] = property.id;
    this.bookmarkService.setCurrentBookmark(tmpBookmark);
    this.router.navigate(['user/property/'+property.id]);
  }

  isSelectedProperty(property){
    return this.selectedProp == property;
  }

 getPlaceDetails(place: any){
   console.log("place: ", place);
   console.log("place.geometry: ", place.geometry);
   if(place.geometry==undefined){
     //set an error - show the error under google search line
     // a custom validator need to be defined and an error message "Place not found" need to be shown
     this.noBookmarkError = true;
     //console.log("noBookmarkError:",this.noBookmarkError);
     return;
   }else{
     this.noBookmarkError = false;
   }
      this.latitute = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      
      this.model.locality = '';
      this.model.city = '';
      this.model.state = '';
      this.model.zipCode = '';
      ////console.log("Place",place)
      for(let i = 0; i < place.address_components.length ; i++){
        ////console.log(place.address_components[i].types[0]);
        switch(place.address_components[i].types[0]){
          case 'street_number' :this.model.locality=place.address_components[i].long_name+ ' ';break;
          case 'route':this.model.locality=this.model.locality+place.address_components[i].long_name;break;          
          // case 'locality': {
          //   ////console.log(this.model.city.length);
          //   if(this.model.city.length==0) this.model.city = place.address_components[i].long_name; 
          //   break;
          // }          
          case 'administrative_area_level_2': {
            ////console.log(this.model.city.length);
            if(this.model.city.length==0) this.model.city = place.address_components[i].long_name; 
            break;
          }
          case 'administrative_area_level_1': this.model.state = place.address_components[i].short_name; break;
          case 'postal_code': this.model.zipCode = place.address_components[i].short_name; break;
          default: break;
        }
      }
 }

 resetLatLng(){
   this.latitute =null;
   this.longitude = null;      
 }

 addToHistory(propertyJson){
   var data={
     User_ID:this.auth.getUserId(),
     property:propertyJson
   }
   this.bookmarkService.addToHistory(data)
   .subscribe((result)=>{
     console.log(result);
   },(err)=>{
     console.log(err);
   })
 }

}
