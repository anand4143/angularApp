import { Component, OnInit } from '@angular/core';
//import { FormGroup, FormBuilder,Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookmarkService } from '../bookmark/bookmark.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BookmarkApplicationService,FileService, AuthService,GobackbuttonService,ConfigService } from '../common';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';
import { SuccessComponent } from '../dialog/success/success.component';
import { DialogService } from "ng2-bootstrap-modal";

declare var HelloSign:any;
@Component({
  selector: 'app-lease-documents',
  templateUrl: './lease-documents.component.html',
  styleUrls: ['./lease-documents.component.css']
})
export class LeaseDocumentsComponent implements OnInit {
  appDocuments: any = [];
  constants = CONSTANTS;
  fileCounter: number = 0;
  sendToBrokerBtn: boolean ;
  rent: string = 'NA';
  //leaseFrm: FormGroup;
  //error: string = '';

   constructor(
    private router        : Router, 
    private auth          : AuthService,
    private bkmrk         : BookmarkService,
    private bkmAppSrv     : BookmarkApplicationService,
    private gbSrv         : GobackbuttonService,
    private fileSrv       : FileService,
    private dialogService : DialogService,
    private route         : ActivatedRoute,
    private cfgSrv        : ConfigService,
    //private frmbuilder: FormBuilder, 
  )  { 
    // this.leaseFrm = frmbuilder.group({
    //   'userdoc': [null, Validators.required]
    // })
    // this.leaseFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.bkmrk.loadNewBookmark(params['bkmrkId'])
      .subscribe((res) =>{
         this.bkmAppSrv.setSelectedBookmarkId(params['bkmrkId']);
         this.rent=res.Property_JSON.price
          this.bkmAppSrv.getApplication()          
          .subscribe((res)=>{ 
            console.log("application====>",res);
            if(res.Bookmark_Application_Status == CONSTANTS.bookmarkApplicationStatus.docSigned){
              this.sendToBrokerBtn = false;
            }
            if(res.Bookmark_Application_Status == CONSTANTS.bookmarkApplicationStatus.docLoaded){
              this.sendToBrokerBtn = true;
            }
            this.fileSrv.getDocuments(this.bkmAppSrv.getApplicationId())
            .subscribe((res)=>{
              console.log("result doc:",res);
              this.appDocuments = res;
              this.checkDocStatus(this.appDocuments);              
            });
          });
      });

    });
  }

  checkDocStatus(docs){
    console.log("Inside",docs)
    this.fileCounter=0;
    docs.forEach(function(doc){
      if(doc.Document_Status  ==  CONSTANTS.bkmrkAppDocStatus.signed){
        doc.disable=true;
        this.fileCounter ++;
      }
    },this)   
  }



  openHelloSign(docObject,index){ 
    let leaseDocumentsComponent=this;
    // console.log("docObject:",docObject);
    console.log("Hellosign client id",this.cfgSrv.getHelloSignClientID());
    this.fileSrv.curlHelloSign(docObject.Document_Signature_ID).subscribe(
     (data) => {
         console.log("curlHelloSign data: ",data);
     },
     (err) => {
       console.log("curlHelloSign err: ",err);
     }
   );
    HelloSign.init(this.cfgSrv.getHelloSignClientID());
    HelloSign.open({         
        url: docObject.Document_Sign_URL,     
        allowCancel: true, 
        skipDomainVerification: true,
        messageListener: function(eventData) {
          console.log("response :",eventData);
          if(eventData.event=='signature_request_signed'){
            //leaseDocumentsComponent.appDocuments.forEach(leaseDocumentsComponent.checkDocStatus, leaseDocumentsComponent)
            leaseDocumentsComponent.fileSrv.signDocument(eventData,docObject.Bookmark_Application_Document_ID)
            .subscribe((result) =>{
              console.log("result",result);
              leaseDocumentsComponent.appDocuments[index] = result;
              leaseDocumentsComponent.appDocuments[index].disable=true;
              console.log(leaseDocumentsComponent.appDocuments);
              leaseDocumentsComponent.checkDocStatus(leaseDocumentsComponent.appDocuments)
            },
            (err)=>{
              console.log("err:",err);
            });
          }  
        } 
      });
  }

  sendDocumentToBroker(){

    console.log("this is sendDocumentToBroker function");
    this.fileSrv.sendDocumentToBroker(this.bkmAppSrv.getApplicationId())
    .subscribe((res) => {
        console.log("send to broker:",res);
        // this.bkmAppSrv.getApplication()
        //   .subscribe((res)=>{});
        this.sendToBrokerBtn=false;
        this.successDialog(MESSAGES['TXT31'])
    },
    (err) =>{
         console.log("send to broker err:",err);
    });
  }

  gbf() {
    this.gbSrv.gbf();
  }

  successDialog(msg) {  
    console.log(msg);    
    let disposable = this.dialogService.addDialog(SuccessComponent, {
      message: msg
    })
    .subscribe((res) => {
      if (res) {
      console.log("closed");
      }
    });
  }

}
