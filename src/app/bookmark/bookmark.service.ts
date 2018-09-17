import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../common';
import { ConfigService, AuthService, BookmarkApplicationService } from '../common';
import { CONSTANTS } from '../app.constants';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class BookmarkService {
  /* Find Properties and Pagination Variables */
  private propertyList: any = [];
  private propertyTotCount: number = 0;
  private propertyTotPages: number = 0;
  private propertyCurPage: number = 0;
  private propertyRunPage: number = 0;
  private propertySearchQuery: any = {};

  /* Bookmark List and Current Bookmark - Control variables */
  private bookmarkList: any;
  private currentBookmark: any = null;
  private bookmarkStatus: number = 0;

  /* For Displaying Property Related Lists */
  private renterList: any;
  private brokerList: any;

  /* For Displaying Property details */
  private renterDetails: any = [];
  private propAddress: any = '';
  private addressArray: any = [];
  private forRentArray: any = [];
  private propertyDetailsArray: any = [];
  private amenitiesArray: any = [];
  private openHouseArray: any = [];
  private propertyImageArray: any = [];

  private defaultSidebar = true;
  private bookmarkCount: number = 0;
  private historyAvailable: boolean = false;
  private clientButton: boolean = false;


  private paymentEnabled:boolean=false;

  constructor(
    private http: HttpService,
    private configService: ConfigService,
    private auth: AuthService,
    private bkmAppSrv: BookmarkApplicationService
  ) { }

  resetAll() {
    this.propertyList = [];
    this.propertyTotCount = 0;
    this.propertyTotPages = 0;
    this.propertyCurPage = 0;
    this.propertyRunPage = 0;
    this.bookmarkList = [];
    this.currentBookmark = null;
    this.bookmarkStatus = 0;
    this.renterList = [];
    this.brokerList = [];
    this.renterDetails = [];
    this.addressArray = [];
    this.forRentArray = [];
    this.propertyDetailsArray = [];
    this.amenitiesArray = [];
    this.openHouseArray = [];
    this.propertyImageArray = [];
    this.paymentEnabled=false;
    this.clientButton = false;
  }

  getPaymentEnabled(){
    return this.paymentEnabled;
  }

  setPaymentEnabled(){
    this.paymentEnabled=true;
  }

  getSidebar() {
    this.bookmarkList = [];
    console.log('getSidebar');
    if(Number(this.auth.getUserRole()) == CONSTANTS.userRole.renter && !this.defaultSidebar) this.setHistoryList().subscribe();
    else if(Number(this.auth.getUserRole()) == CONSTANTS.userRole.landlord) {
      if(this.clientButton) this.setClientListForLandlord().subscribe();
      else this.setBookmarkList().subscribe();
    }
    else this.setBookmarkList().subscribe();

    
    // if (this.defaultSidebar) this.setBookmarkList().subscribe();
    // else this.setHistoryList().subscribe();
  }

  /* Property Listing and Pagination - Start */
  setpropertyRunPage(page) {
    this.propertyRunPage = page;
  }

  getpropertyRunPage() {
    return this.propertyRunPage;
  }

  getpropertyTotCount() {
    return this.propertyTotCount;
  }

  resetNestIOCurpage() {
    this.propertyCurPage = 0;
  }

  isNestIOCurpage(curPage) {
    if (this.propertyTotPages == 1 && this.propertyCurPage) return true;
    return (Math.floor((curPage / 5) + 1) == this.propertyCurPage);
  }

  getpropertySearchQuery() {
    return this.propertySearchQuery;
  }

  setpropertySearchQuery(searchModel) {
    //console.log("setpropertySearchQuery searchModel:",searchModel);
    this.propertySearchQuery = searchModel;
  }

  resetPropertyList() {
    this.propertyList = [];
    this.propertySearchQuery = {};
    this.propertyTotCount = 0;
    this.propertyTotPages = 0;
    this.propertyCurPage = 0;
    this.propertyRunPage = 0;
  }

  getNestIOProperties(curPage, lat, lng, address, aptnumber) {
    this.propertyList = [];
    let nestioPage = Math.floor((curPage / 5) + 1);
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    var filter = '';
    if (address) filter = filter + '/address/' + address;
    if (aptnumber) filter = filter + '/aptnumber/' + aptnumber;
    let url = this.configService.getBasePath() + '/properties/lat/' + lat + '/lng/' + lng + filter + '/page/' + nestioPage;
    //console.log("getNestIOProperties Hitting");     
    return this.http.get(url, options)
      .map((response: Response) => {
        let res = response.json();
        //console.log(res);
        this.propertyList = res.items;
        this.propertyTotCount = Number(res.total_items);
        this.propertyTotPages = Number(res.total_pages);
        this.propertyCurPage = Number(res.page);
        return this.propertyTotCount;
      })
      .catch((error: any) => {
        //console.log(error);          
        return Observable.throw(error);
      });
  }

  getProperties(pageNum) {
    this.propertyRunPage = pageNum;
    let start = Math.floor((pageNum % 5) - 1) * 10;
    if (pageNum % 5 == 0) start = 40;
    if (this.propertyTotPages == 1) start = (pageNum - 1) * 10;
    return this.propertyList.slice(start, start + 10);
  }


  getPropertyCount() {
    ////console.log("this.propertyList.length: ",this.propertyList.length);
    return this.propertyList.length;
  }

  setClientListForLandlord(){
    // this.bookmarkList = [];
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/applications/';
    muUrl = muUrl + 'landlord/' + this.auth.getUserId() + '/clients';
    return this.http.get(muUrl, options)
      .map((response: Response) => {
        this.bookmarkList = response.json();
        this.bookmarkList = this.bookmarkList;
        this.bookmarkCount = this.bookmarkList.length;
        return response.json();
      })
      .catch((error) => Observable.throw(error.json()));
  }

  setClientListForBroker(){
    // this.bookmarkList = [];
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/bookmarks/';
    if(this.defaultSidebar) muUrl = muUrl + 'broker/' + this.auth.getUserId() + '/currentClients';
    else muUrl = muUrl + 'broker/' + this.auth.getUserId() + '/closedClients';
    return this.http.get(muUrl, options)
      .map((response: Response) => {
        this.bookmarkList = response.json();
        this.bookmarkList = this.bookmarkList;
        this.bookmarkCount = this.bookmarkList.length;
        return response.json();
      })
      .catch((error) => Observable.throw(error.json()));
  }

  setBookmarkList() {
    // this.bookmarkList = [];
    console.log("setBookmarkList called...");
    // this.fetchBookmark = true;
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/bookmarks/';
    if (Number(this.auth.getUserRole()) == CONSTANTS.userRole.renter) muUrl = muUrl + this.auth.getUserId() + '/all';
    else if (Number(this.auth.getUserRole()) == CONSTANTS.userRole.broker) {
      // muUrl = muUrl + 'broker/' + this.auth.getUserId() + '/all';
      if(this.defaultSidebar) muUrl = muUrl + 'broker/' + this.auth.getUserId() + '/current';
      else muUrl = muUrl + 'broker/' + this.auth.getUserId() + '/closed';
    } else if (Number(this.auth.getUserRole()) == CONSTANTS.userRole.landlord) muUrl = muUrl + 'landlord/' + this.auth.getUserId() + '/all';
    return this.http.get(muUrl, options)
      .map((response: Response) => {
        if(Number(this.auth.getUserRole()) == CONSTANTS.userRole.renter)this.defaultSidebar = true;
        //console.log("setBookmarkList function:=:",response);
        this.bookmarkList = response.json();
        this.bookmarkList = this.bookmarkList;
        this.bookmarkCount = this.bookmarkList.length;
        console.log(" setBookmarkList: ", this.bookmarkList);
        // this.fetchBookmark = false;
        if (!(Number(this.auth.getUserRole()) == CONSTANTS.userRole.broker) && !this.currentBookmark) {
          this.setPropertyBroker();
        }
        return response.json();
      })
      .catch((error) => Observable.throw(error.json()));
  }
  /* Property Listing and Pagination - End */


  getBookmarkCount() {
    return this.bookmarkCount;
  }

  setHistoryList() {
    console.log("setHistoryList");
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/properties/user/' + this.auth.getUserId() + '/historyList';
    // muUrl = muUrl + this.auth.getUserId() + '/all';
    console.log("muUrl", muUrl);
    return this.http.get(muUrl, options)
      .map((response: Response) => {
        this.defaultSidebar = false;
        console.log("Response", Response);
        if (response) {
          this.bookmarkList = response.json();
          this.bookmarkList = this.bookmarkList;
          console.log("this.bookmarkList.length: ", this.bookmarkList.length);
          if(this.bookmarkList.length) this.historyAvailable = true;
          else {
            this.historyAvailable = false;
            this.defaultSidebar = true;
          }
          // this.historyCount = this.bookmarkList.length;
          console.log(" this.bookmarkList: ", this.bookmarkList);

        }
        return response.json();
      })
      .catch((error) => Observable.throw(error.json()));
  }

  getSideBarStatus() {
    // console.log("getSideBarStatus: ",this.defaultSidebar)
    return this.defaultSidebar;
  }

  setSideBarStatus() {
    // console.log("Toggling..")
    this.defaultSidebar = true;
  }

  resetSideBarStatus() {
    // console.log("Toggling..")
    this.defaultSidebar = false;
  }

  getClientButtonStatus(){
    return this.clientButton;
  }

  setClientButton(){
    this.clientButton = true;
  }

  resetClientButton(){
    this.clientButton = false;
  }

  setHistoryCount() {
    console.log("setHistoryCount");
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/properties/user/' + this.auth.getUserId() + '/checkhistory';
    // muUrl = muUrl + this.auth.getUserId() + '/all';
    console.log("muUrl", muUrl);
    return this.http.get(muUrl, options)
      .map((response: Response) => {
        if (response) {
          console.log("setHistoryCount response: ", response);
          // console.log("setHistoryCount available: ", response.json().available);
          if (response.json().available == true) {
            console.log('if...');
            this.historyAvailable = true;
          }else {
            console.log('else...');
            this.historyAvailable = false;
          }
          console.log("setHistoryCount available: ", this.historyAvailable);
        }
        //  return response.json();
      })
      .catch((error) => Observable.throw(error.json()));
  }

  getHistorycount() {
    return this.historyAvailable;
  }


  addToHistory(data) {
    console.log("adding to history");
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/properties/addToHistory';
    // muUrl = muUrl + this.auth.getUserId() + '/all';
    console.log("muUrl", muUrl);
    return this.http.post(muUrl, data, options)
      .map((response: Response) => {
        console.log("Response", Response);
        this.historyAvailable = true;
        return response;
      })
      .catch((error) => Observable.throw(error.json()));
  }

  getBookmarkList() {
    // console.log("getBookmarkList: ",  this.bookmarkList);
    return this.bookmarkList;
  }

  resetBookmarkList() {
    this.bookmarkList = [];
  }

  viewNestIOProperty(bkMark) {
    this.currentBookmark = bkMark;
    if (this.currentBookmark) {
      //console.log("Set Current Bookmark: ", bkMark.Property_JSON)
      this.bookmarkStatus = 0;
      if (this.currentBookmark.Property_JSON) this.loadPageDetails();
    }
  }

  getHistoryDetails(sourceId) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/properties/NIO/' + sourceId;
    return this.http.get(muUrl, options)
      .subscribe((response: Response) => {
        console.log("getHistoryDetails response: ", response.json());
        if(this.currentBookmark)this.currentBookmark.Property_JSON = response.json();
        this.loadPageDetails();
      });
  }

  loadPageDetails() {
    this.setAddressArray();
    this.setRentArray();
    this.setDetailArray();
    this.setAmenitiesArray();
    this.setOpenHouseArray();
    this.setImageArray();
  }

  setCurrentBookmark(bkMark) {    
    //console.log("setCurrentBookmark function  bkMark:",bkMark);
    if (!bkMark.Property_ID) this.viewNestIOProperty(bkMark);
    else this.setBookmark(bkMark.Property_ID).subscribe();
  }

  setClient(clientID){
    this.currentBookmark = {};
    this.currentBookmark.Renter_ID = clientID;
  }

  setBookmark(propID) {
    console.log("setBookmark propID from service:",propID);
    var isUserRenter = (Number(this.auth.getUserRole()) == Number(CONSTANTS.userRole.renter));
    // if(isUserRenter) this.fetchBookmark = true;
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let muUrl = this.configService.getBasePath() + '/bookmarks/property/' + propID;
    if (isUserRenter) muUrl = muUrl + '/user/' + this.auth.getUserId();
    return this.http.get(muUrl, options)
      .map((response: Response) => {
        //console.log("setBookmark response ",response);
        // if(isUserRenter) this.fetchBookmark = false;
        this.currentBookmark = response.json();
        console.log("this.currentBookmark bookmark service=>: ", this.currentBookmark);
        if (this.currentBookmark) {
          this.bookmarkStatus = 0;
          if (this.currentBookmark.Bookmark_ID) {
            this.getBookmarkStatus();  
            this.getAllCombinedStatus(this.currentBookmark.Bookmark_ID);          
          }
          this.setRenterInfo();
          this.loadPageDetails();          
        }
        return this.currentBookmark;
      }, () => {
        // if(isUserRenter) this.fetchBookmark = false;
      });
  }


  getCurrentBookmark() {
     //console.log('getCurrentBookmark==>', this.currentBookmark);
    return this.currentBookmark;
  }

  setPropertyBroker() {
    if (!this.currentBookmark) return;
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/bookmarks/property/' + this.currentBookmark.Property_ID + '/getbrokers/all';
    this.http.get(url, options)
      .subscribe((result) => {
        this.brokerList = result.json();
      });
  }

  getPropertyBroker() {
    return this.brokerList;
  }

  resetCurrentBookmark() {
    this.currentBookmark = null;
    this.bookmarkStatus = 0;
    this.addressArray = [];
    this.forRentArray = [];
    this.propertyDetailsArray = [];
    this.amenitiesArray = [];
    this.openHouseArray = [];
    this.propertyImageArray = [];
  }

  initCurrentBookmark() {
    if (this.currentBookmark == null) this.setCurrentBookmark(this.bookmarkList[0])
  }

  isCurrentBookmark(bkMarkItem) {
    if (!this.currentBookmark || !bkMarkItem) return false;
    // console.log("Good Morning..", this.currentBookmark.Source_ID, bkMarkItem.Source_ID)
    // return this.currentBookmark.Property_ID == bkMarkItem.Property_ID;
    if(this.clientButton) return this.currentBookmark.Renter_ID == bkMarkItem.Renter_ID;
    return this.currentBookmark.Source_ID == bkMarkItem.Source_ID;
  }

  setRenterDetails(renterId){
    this.renterDetails = [];
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/users/' + renterId + '/info';
    return this.http.get(url, options)
      .map((response: Response) => {
        console.log("setRenterDetails: ", response);
        response = response.json();
        this.renterDetails.push(response['User_First_Name'] + ' ' + response['User_Last_Name']);
        this.renterDetails.push(response['Email_Address']);
        this.renterDetails.push(response['Contact_Num']);
      })
      .catch((error: any) => Observable.throw(error));
  }

  getRenterDetails(){
    return this.renterDetails;
  }

  setAddressArray() {
    //console.log("Set Address Array");
    //console.log("Set Address Array: ", this.currentBookmark.Property_JSON)
    this.addressArray = [];
    this.propAddress = '';
    if (this.currentBookmark && this.currentBookmark.Property_JSON) {
      this.propAddress = this.currentBookmark.Property_JSON.street_address + ', ' + this.currentBookmark.Property_JSON.building.city
        + ', ' + this.currentBookmark.Property_JSON.building.state + ', ' + this.currentBookmark.Property_JSON.building.postal_code;
      if (this.currentBookmark.Property_JSON.street_address) this.addressArray.push(this.currentBookmark.Property_JSON.street_address);
      if (this.currentBookmark.Property_JSON.unit_number) this.addressArray.push(this.currentBookmark.Property_JSON.unit_number);
      if (this.currentBookmark.Property_JSON.building.city) this.addressArray.push(this.currentBookmark.Property_JSON.building.city);
      if (this.currentBookmark.Property_JSON.building.postal_code) this.addressArray.push(this.currentBookmark.Property_JSON.building.postal_code);
    }
  }

  getPropAddress() {
    //console.log("property address:",this.propAddress);
    return this.propAddress;
  }

  getAddressArray() {
    return this.addressArray;
  }

  setRentArray() {
    this.forRentArray = [];
    if (this.currentBookmark) {
      this.forRentArray.push("FOR RENT");
      if (this.currentBookmark['Property_JSON']['price'])
        this.forRentArray.push("$ " + this.currentBookmark['Property_JSON']['price'] + " PER MONTH");
      if (this.currentBookmark['Property_JSON']['date_available'])
        this.forRentArray.push("Available " + this.currentBookmark['Property_JSON']['date_available']);
      if (this.currentBookmark['Property_JSON']['neighborhood'])
        this.forRentArray.push(this.currentBookmark['Property_JSON']['neighborhood']['name']);
      if (this.currentBookmark['Property_JSON']['listing_company'])
        this.forRentArray.push("Listed by " + this.currentBookmark['Property_JSON']['listing_company']['name']);
    }
  }

  getRentArray() {
    return this.forRentArray
  }

  setDetailArray() {
    this.propertyDetailsArray = [];
    if (this.currentBookmark) {
      this.propertyDetailsArray.push("DETAILS");
      if (this.currentBookmark['Property_JSON']['square_footage'])
        this.propertyDetailsArray.push(this.currentBookmark['Property_JSON']['square_footage'] + " SQ FT");
      if (this.currentBookmark['Property_JSON']['total_rooms'])
        this.propertyDetailsArray.push(this.currentBookmark['Property_JSON']['total_rooms'] + " rooms");
      if (this.currentBookmark['Property_JSON']['bathrooms'])
        this.propertyDetailsArray.push(this.currentBookmark['Property_JSON']['bathrooms'] + " bathrooms");
      if (this.currentBookmark['Property_JSON']['bedrooms'])
        this.propertyDetailsArray.push(this.currentBookmark['Property_JSON']['bedrooms'] + " bedrooms");
    }
  }

  getDetailArray() {
    return this.propertyDetailsArray;
  }

  setAmenitiesArray() {
    this.amenitiesArray = [];
    if (this.currentBookmark) {
      this.amenitiesArray.push("AMENITIES");
      if (this.currentBookmark['Property_JSON']['amenities'] && this.currentBookmark['Property_JSON']['amenities'].length > 0) {
        this.currentBookmark['Property_JSON']['amenities'].forEach(function (itm, idx) {
          this.amenitiesArray.push(itm);
        }, this);
      }
      else this.amenitiesArray.push("Data is not available");
    }
  }

  getAmenitiesArray() {
    return this.amenitiesArray;
  }

  setOpenHouseArray() {
    this.openHouseArray = [];
    if (this.currentBookmark) {
      this.openHouseArray.push("OPEN HOUSE");
      if (this.currentBookmark['Property_JSON']['open_houses'] && this.currentBookmark['Property_JSON']['open_houses'].length > 0) {
        this.currentBookmark['Property_JSON']['open_houses'].forEach(function (itm, idx) {
          this.openHouseArray.push(itm.date + ' @ ' + itm.start_time + ' - ' + itm.end_time);
        }, this);
      }
      else this.openHouseArray.push("Data is not available");
    }
  }

  getOpenHouseArray() {
    return this.openHouseArray;
  }

  setImageArray() {
    if (this.currentBookmark) {
      if (this.currentBookmark['Property_JSON']['photos'])
        this.propertyImageArray = this.currentBookmark['Property_JSON']['photos'];
    }
  }

  getImageArray() {
    return this.propertyImageArray;
  }
  getImageArrayLength() {
    return this.propertyImageArray.length;
  }

  bookmarkProperty(property) {
    var toBeBookmarked = {
      User_ID: this.auth.getUserId(),
      property: property.Property_JSON
    };
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/properties/bookmark';
    return this.http.post(url, toBeBookmarked, options)
      .map((response: Response) => {
        this.currentBookmark = response.json();
        this.bookmarkStatus = CONSTANTS.bookmarkStatus.toBeApplied;

        return this.currentBookmark;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  getRenterInfo() {
    return this.renterList;
  }

  setRenterInfo() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/properties/' + this.currentBookmark.Property_ID + '/renterinfo/all';
    this.http.get(url, options)
      .subscribe((result) => {
        this.renterList = result.json();
      });
  }

  getAppliedBookmarks(propId) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/bookmarks/all/property/' + propId;
    return this.http.get(url, options)
      .map((result) => result.json());
  }

  getAccessInfo() {
    let accessInfo: String = '';
    if (this.currentBookmark) {
      ////console.log("this.currentBookmark getAccessInfo function :",this.currentBookmark);
      ////console.log("getAccessInfo :",this.currentBookmark['Property_JSON']);
      if (this.currentBookmark['Property_JSON']['access_info'])
        accessInfo = this.currentBookmark['Property_JSON']['access_info'];
    }
    return accessInfo;
  }

  bookmarkApply() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let bkmarkApplication: any = {};
    bkmarkApplication.Bookmark_ID = this.currentBookmark.Bookmark_ID;
    let url = this.configService.getBasePath() + '/applications/apply';
    return this.http.post(url, bkmarkApplication, options)
      .map((result) => {
        this.bookmarkStatus = CONSTANTS.bookmarkStatus.applied;
      });
  }

  getBookmarkStatus() {
    //console.log("Inside getBookmarkStatus.")
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/bookmarks/get/' + this.currentBookmark.Bookmark_ID;
    this.http.get(url, options)
      .subscribe((result) => {
        result = result.json();
        //console.log("getBookmarkStatus:",result);
        if (result && result['Bookmark_Status'])
          this.bookmarkStatus = result['Bookmark_Status'];
        console.log("this.bookmarkStatus from service::",this.bookmarkStatus);
        if (this.currentBookmark && this.bookmarkStatus > CONSTANTS.bookmarkStatus.applied) this.bkmAppSrv.getBrokerDetails(this.currentBookmark.Bookmark_ID);
      })
  }

  getCurrentBookmarkStatus() {
    return this.bookmarkStatus;
  }

  loadBookmark(bkmId) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/bookmarks/getproperty/' + bkmId;
    this.http.get(url, options)
      .subscribe((result) => {
        this.setCurrentBookmark(result.json());
        //console.log(result.json());
      });
  }

  loadNewBookmark(bkmId) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/bookmarks/getproperty/' + bkmId;
    return this.http.get(url, options)
      .map((result) => {
        this.currentBookmark = result.json();
        console.log('this.currentBookmark: ', this.currentBookmark)
        this.setRenterInfo();
        this.loadPageDetails();
        return result.json();
      });
  }

  getNioProperty(NioPropertyID) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    let url = this.configService.getBasePath() + '/properties/' + NioPropertyID + '/user/' + this.auth.getUserId() + '/source/NIO';
    return this.http.get(url, options)
      .map((result) => {
        //console.log("getNioProperty from service:",result);
        return result.json();
      });
  }

  checkCurrentBookmarkId() {
    return this.currentBookmark && this.currentBookmark.Bookmark_ID;
  }


  isCurrentBookmarkId() {
    if (!(this.currentBookmark && this.currentBookmark.Bookmark_ID)) {
      return true;
    }
  }

  removeBookmark(bookmarkID) {
    var data = { "Bookmark_ID": bookmarkID }
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    var myUrl = this.configService.getBasePath() + '/applications/bookmark/unmark';
    return this.http.put(myUrl, data, options)
      .map((response: Response) => response);
  }

  setPriorityOfBookmark(bookmarkID, priority) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    var myUrl = this.configService.getBasePath() + '/bookmarks/' + bookmarkID + '/setpriority/' + priority;
    return this.http.put(myUrl, null, options)
      .map((response: Response) => response);
  }


  removeHistoryBookmark(searchHistoryId) {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
    let options = new RequestOptions({ headers: headers });
    var myUrl = this.configService.getBasePath() + '/properties/history/' + searchHistoryId;
    return this.http.delete(myUrl, options)
      .map((response: Response) => response);
  }

  
  getAllCombinedStatus(bookmarkId){     
      let headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.getToken() });
      let options = new RequestOptions({ headers: headers });
      var myUrl = this.configService.getBasePath() + '/bookmarks/'+ bookmarkId+ '/getAllStatus';
      this.http.get(myUrl, options)
      .subscribe((result) => {        
        result = result.json();
        this.paymentEnabled = ((result.Bookmark_Status == CONSTANTS.bookmarkStatus.approved) && 
        (result.Bookmark_Application_Status == CONSTANTS.bookmarkApplicationStatus.leased) && 
        (result.Contract_Status == CONSTANTS.contractStatus.leased));
        console.log("Payment status",this.paymentEnabled);        
      })             
  }
}
