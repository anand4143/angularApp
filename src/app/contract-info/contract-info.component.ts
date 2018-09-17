import { Component, OnInit } from '@angular/core';
import { AuthService , GobackbuttonService, BookmarkApplicationService, PhonenumberPipe} from '../common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {  MyDatePickerModule } from 'mydatepicker';
import { RegisterPayInfoService} from '../register-pay-info/register-pay-info.service';
import { ContractInfoService} from './contract-info.service';
import { SuccessComponent } from '../dialog/success/success.component';
import { DialogService } from "ng2-bootstrap-modal";
import { DatePipe } from '@angular/common';
import { MESSAGES } from '../app.messages';

@Component({
  selector: 'app-contract-info',
  templateUrl: './contract-info.component.html',
  styleUrls: ['./contract-info.component.css'],
  providers:[DatePipe,PhonenumberPipe]
})
export class ContractInfoComponent implements OnInit {

  newContractFrm:any={};
  contractModel:any={};
  propertyDetail:any={};
  error:'';
  // endContractDate='';
  // fromContractDate='';
  dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,10,21,22,23,24,25,26,27,28]
  // myDatePickerOptions  = {showTodayBtn:true,dateFormat:'mm/dd/yyyy',disableUntil:{}};
  // myFromDatePickerOptions= Object.assign({}, this.myDatePickerOptions,); 
  // myToDatePickerOptions = Object.assign({}, this.myDatePickerOptions); 
  maxDuration:any='';
  minDuration:any='';  
  //  private fromDateplaceholder  : string = 'CONTRACT START DATE';
  //  private toDateplaceholder  : string = 'CONTRACT END DATE';

  constructor(
    private router        : Router,    
    private route         : ActivatedRoute,
    private frmbuilder    : FormBuilder, 
    private auth          : AuthService,
    private gbSrv         : GobackbuttonService,
    private regPayInfo    : RegisterPayInfoService,
    private bkmrkappServ  : BookmarkApplicationService,
    private dialogService: DialogService,
    private contractInfoServ : ContractInfoService,
    private _datePipe:DatePipe
  ) {

    this.newContractFrm = frmbuilder.group({
      //'Paypal_Email_Address' : [null, Validators.required],
      'Monthly_Rent':[null, Validators.required],                  
      'Contract_Start_Date' : [null, Validators.required],
      'Contract_End_Date' : [null, Validators.required],     
      'Rent_Due_Date' : [0, Validators.compose([Validators.required, Validators.pattern('^([1-9]|[12]\d|3[0-1])$')])] 
    })
    this.newContractFrm.valueChanges.subscribe(data => this.error = '');
   }

  ngOnInit() {   
    //this.getPaymentInfo();  
    this.contractModel.Rent_Due_Date = 0;
    this.route.params.subscribe((params: Params) => {
      this.contractInfoServ.fetchBookmark(params['bkmrkId'])
        .subscribe((data) => {
          console.log(data);
          this.propertyDetail=data['Property_JSON'];
          this.loadFieldData(data['Property_JSON']); 
        },
        (err) => {
          console.log(err);
        });
    });  
  }

  // onFromDateChanged(event:any){    
  //   this.contractModel['Contract_Start_Date']  = this._datePipe.transform(new Date(event.formatted), 'yyyy-MM-dd')    
  //   this.newContractFrm.controls['Contract_Start_Date'].setValue(event.formatted);            
  // }

  // onToDateChanged(event:any){   
  //   this.contractModel['Contract_End_Date']  = this._datePipe.transform(new Date(event.formatted), 'yyyy-MM-dd')
  //   this.newContractFrm.controls['Contract_End_Date'].setValue(event.formatted);            
  // }

  createNewContract(){
    console.log(this.contractModel);
    var data =  this.contractModel;
    data.Bookmark_ID=this.route.snapshot.params['bkmrkId'];  
    data.Max_Lease_Term = this.propertyDetail.max_lease_term;
    data.Min_Lease_Term = this.propertyDetail.min_lease_term;
    console.log(data);
    this.contractInfoServ.updateContract(data)
    .subscribe((data)=>{
      console.log(data);
      this.successDialog(MESSAGES['TXT26']);
      this.router.navigate(['/landlord/payment/' + this.route.snapshot.params['bkmrkId']])
    },(err)=>{
      console.log(err.code)
      if(err.code == 'CCRC04') this.successDialog(MESSAGES['TXT27']);
      if(err.code == 'CCRC05') this.successDialog(MESSAGES['TXT28']);
      if(err.code == 'CCRC06') this.successDialog(MESSAGES['TXT29']);
      // if(err.code == 'CCRC07') this.successDialog(MESSAGES['TXT29']);
    })

  }

  getPaymentInfo(){   
    this.regPayInfo.getPaymentInfoData()
    .subscribe((data)=>{
      console.log(data);
      if(this.regPayInfo.getPaypalId()){
        console.log("Added");
        this.contractModel.Paypal_Email_Address=this.regPayInfo.getPaypalId();
      }     
    },(err)=>{
      console.log(err);
    })
  }

  gbf() {
    this.gbSrv.gbf();
  } 
 

  loadFieldData(property){
    this.contractModel.Monthly_Rent=property['price'];    
    // var startDate = (new Date(property['date_available']) > new Date()) ? new Date(property['date_available']):new Date(); 
    // console.log('loading', startDate);    
    // this.contractModel['Contract_Start_Date'] = this._datePipe.transform(startDate, 'yyyy-MM-dd');   
    this.maxDuration=property['max_lease_term']? property['max_lease_term']:12;
    this.minDuration=property['min_lease_term']? property['min_lease_term']:12;
  }

  successDialog(msg) {  
    console.log(msg);    
    let disposable = this.dialogService.addDialog(SuccessComponent, {
      message: msg
    })
    .subscribe((res) => {
      if (res) {
        console.log('closed')
      }
    });
  }

  startfocusFunction(event){
    console.log('Focused',event.srcElement.type)
    event.srcElement.type='date';
  }

  startoutFocusFunction(event){
    console.log('Out focused',event.srcElement.type);    
    if(this.newContractFrm.controls['Contract_Start_Date'].touched && this.newContractFrm.controls['Contract_Start_Date'].hasError('required')){
      event.srcElement.type='text';
    }    
  }

  endfocusFunction(event){
    console.log('Focused',event.srcElement.type)
    event.srcElement.type='date';
  }

  endoutFocusFunction(event){
    console.log('Out focused',event.srcElement.type);    
    if(this.newContractFrm.controls['Contract_End_Date'].touched && this.newContractFrm.controls['Contract_End_Date'].hasError('required')){
      event.srcElement.type='text';
    }    
  }  
  
}
