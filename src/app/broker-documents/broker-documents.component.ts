import { Component, OnInit,ViewChild,Renderer,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BookmarkApplicationService, FileService ,GobackbuttonService} from '../common';
import { BookmarkService } from '../bookmark/bookmark.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SuccessComponent } from '../dialog/success/success.component';
import { DialogService } from "ng2-bootstrap-modal";
import { Observable } from 'rxjs/Rx';
import { CONSTANTS } from '../app.constants';
import { MESSAGES } from '../app.messages';

@Component({
  selector: 'app-broker-documents',
  templateUrl: './broker-documents.component.html',
  styleUrls: ['./broker-documents.component.css']
})
export class BrokerDocumentsComponent implements OnInit {
  @ViewChild('fileInput') fileInput:ElementRef;
  documentFrm: FormGroup;
  error: string = '';
  fileUploads: any = [];
  approveModel: any = {};
  bookmarkId:string = '';
  constants = CONSTANTS;
  appDocuments: any = [];
  pendingUpload: number = 0;
  sameFilename:boolean = false;
  message = MESSAGES;

  constructor(
    private route: ActivatedRoute,
    private bkmrkAppSrv: BookmarkApplicationService,
    private bkmrk: BookmarkService,
    private router: Router,
    private fileSrv: FileService,
    private frmbuilder: FormBuilder,
    private dialogService: DialogService,
    private gbSrv : GobackbuttonService
    

  ) {
    this.documentFrm = frmbuilder.group({
      'userdoc': [null, Validators.required]
    })
    this.documentFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['bkmrkId']) {
        this.bookmarkId = params['bkmrkId'];
        this.bkmrkAppSrv.setSelectedBookmarkId(params['bkmrkId']);
        this.bkmrkAppSrv.setBookmarkRenterInfo(params['bkmrkId']);
        this.bkmrk.loadBookmark(params['bkmrkId']);
        this.loadApplication();
         
      }
    });
    this.pendingUpload = 0;
  }

  loadApplication(){
    this.bkmrkAppSrv.getApplication().subscribe((res)=>{      
      /** get all documents based on applicationID */
      this.getDocuments(res.Bookmark_Application_ID);
      // this.fileSrv.getDocuments(res.Bookmark_Application_ID).subscribe((res)=>{
      //   console.log("result:",res);
      //   this.appDocuments = res;
      // });
  
    });
  }

  getDocuments(appID){
    this.fileSrv.getDocuments(appID).subscribe((res)=>{
        console.log("result:",res);
        this.appDocuments = res;
    });
  }


  attachFile(event, seq) {
    
    for (var i = 0; i < event.target.files.length; i++) {
      let selectedDoc:any = event.target.files[i];
      selectedDoc.Document_Original_Name = selectedDoc.name;
      selectedDoc.Document_Status = this.constants.bkmrkAppDocStatus.toBeUploaded;
      this.appDocuments.push(selectedDoc);
      this.pendingUpload++;
    }
    //console.log("this.appDocuments:",this.appDocuments);
    this.checkDuplicateFile(this.appDocuments);
    
  }
  checkDuplicateFile(appDocs){
    var temp: string = '';
    for(var j = 0; j < appDocs.length-1; j++){
      temp = appDocs[j].Document_Original_Name;
      //console.log("temp:",temp + "="+j);
      for( var k = j + 1; k < appDocs.length; k++ ){
        //console.log("appDocs[k].Document_Original_Name:",appDocs[k].Document_Original_Name + "="+k);
        if(temp == appDocs[k].Document_Original_Name){
          console.log("yes file match");
          this.sameFilename = true;
        }
      }
    }
    // if(this.sameFilename) return true;
    // else return false;
  }
  uploadDocument() {
    for (var i = 0; i < this.appDocuments.length; i++) {
      if(this.appDocuments[i].Document_Status == this.constants.bkmrkAppDocStatus.toBeUploaded){
        this.fileUploads.push(this.fileSrv.UploadDocument(this.appDocuments[i], this.bkmrkAppSrv.getApplicationId()));
      }
    }
    
    Observable.onErrorResumeNext(this.fileUploads)
      .subscribe(data => {
        console.log("Data from ForkJoin: ", data);
        this.pendingUpload--;

      },
      err => {
        console.log("Error in Upload: ", err)
      },
      () => {
        // this.pendingUpload = 0;
        console.log("I am DONE..");
        this.getDocuments(this.bkmrkAppSrv.getApplicationId());

      })
  }

  deleteDocument(index) {
    console.log("app doc id:",this.appDocuments[index].Bookmark_Application_Document_ID);
    if(this.appDocuments[index].Document_Status != this.constants.bkmrkAppDocStatus.toBeUploaded){
      console.log("An Uploaded Document...")
      this.fileSrv.deleteDocument(this.appDocuments[index].Bookmark_Application_Document_ID)
      .subscribe((res)=>{
        console.log("Delete Response: ", res);
        this.appDocuments.splice(index, 1);
        this.sameFilename = false;
        this.checkDuplicateFile(this.appDocuments)
      },
      (err) => {
        console.log("delete error:",err);
      })
    } else {
      this.appDocuments.splice(index, 1);
      console.log("after delete:",this.appDocuments);
      this.pendingUpload--;
      this.sameFilename = false;
      this.checkDuplicateFile(this.appDocuments)
      //console.log("after delte return :",this.checkDuplicateFile(this.appDocuments));
    }
  }

  applicationToRenter(){
    console.log("application renter");
    this.bkmrkAppSrv.forwardToRenter().subscribe(()=>{
      this.loadApplication();
      this.successDialog(MESSAGES['TXT30']);
    })
  }

  addLandlord(){
    this.router.navigate(['broker/landlord/'+ this.bookmarkId]);
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

  gbf() {
    this.gbSrv.gbf();
  }
  openFileChooser(){
    console.log("this is upload browser");
    this.fileInput.nativeElement.click();
    this.fileInput.nativeElement.value=null;
  }
}