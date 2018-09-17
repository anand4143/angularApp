import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, FileService, ConfigService, EqualValidator, PasswordValidator, PhoneValidator, EmailValidator, GobackbuttonService } from '../common';
import { MESSAGES } from '../app.messages';
import { UserSummaryService } from '../user-summary';
import { RegisterDialogComponent } from '../dialog/register-dialog/register-dialog.component';
import { SuccessComponent } from '../dialog/success/success.component';
/**confirm model popup */
import { ConfirmComponent } from '../dialog/confirm/confirm.component';
import { DialogService } from "ng2-bootstrap-modal";
import { RegisterIdentificationService } from './register-identification.service';
import { AddressCheckService } from '../address-check/address-check.service';
/**End confirm model popup */
@Component({
  selector: 'app-register-identification',
  templateUrl: './register-identification.component.html',
  styleUrls: ['./register-identification.component.css']
})
export class RegisterIdentificationComponent implements OnInit {
  IDMdl: any = {};
  error = '';
  idFrm: FormGroup;
  docVerifyFrm: FormGroup;
  inputFile: File;
  IDFile: any = {};
  isUploaded: boolean = false;
  isSelected: boolean = false;
  veryfyBut: boolean = false;
  userFile: any;
  isValid = {
    type: true,
    size: true
  };
  errorMessage: String = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private frmbuilder: FormBuilder,
    private gbSrv: GobackbuttonService,
    private usrSrv: UserSummaryService,
    private fileSrv: FileService,
    private dialogService: DialogService,
    private identificationServ: RegisterIdentificationService,
    private addressCheckService: AddressCheckService
  ) {
    this.idFrm = frmbuilder.group({
      'idfiles': [null]
    })
    this.idFrm.valueChanges.subscribe(data => this.error = '');
    this.docVerifyFrm = frmbuilder.group({
      'Gender': [null, Validators.required]
    })
    this.docVerifyFrm.valueChanges.subscribe(data => this.error = '');
  }

  ngOnInit() {
    // this.usrSrv.resetProgress();
    // this.fileSrv.isfileExists('ID')
    //   .subscribe(
    //   res => {
    //     this.IDFile = res;
    //     if (this.IDFile) {
    //       this.isUploaded = true;
    //       this.IDFile.File_Original_Name = res.File_Original_Name;
    //     }
    //   },
    //   err => {
    //     // this.browseBtn = true;
    //     console.log(err);
    //   }
    //   )

    // if (this.auth.isLoggedIn()) {
    //   this.fileSrv.getUserFiles('ID')
    //     .subscribe((user) => {
    //       this.IDFile.File_Original_Name = user.File_Original_Name;
    //       console.log("this.IDFile.File_Original_Name", this.IDFile.File_Original_Name);
    //       console.log("veryfyBut before:", this.veryfyBut);
    //       this.veryfyBut = true;
    //       console.log("veryfyBut after:", this.veryfyBut);
    //     })
    // }
    // this.fetchGender();
    // this.checkDocStatus();
    this.getIdentification();

  }

  getIdentification(){
    this.usrSrv.resetProgress();
    this.identificationServ.resetAll();
     this.fileSrv.isfileExists('ID')
    .subscribe(
      res => {
        this.IDFile = res;
        if (this.IDFile) {
          this.isUploaded = true;
          this.IDFile.File_Original_Name = res.File_Original_Name;
        }
      },
      err => {
        // this.browseBtn = true;
        console.log(err);
      }
      )

    if (this.auth.isLoggedIn()) {
      this.fileSrv.getUserFiles('ID')
        .subscribe((user) => {
          this.IDFile.File_Original_Name = user.File_Original_Name;
          console.log("this.IDFile.File_Original_Name", this.IDFile.File_Original_Name);
          console.log("veryfyBut before:", this.veryfyBut);
          this.veryfyBut = true;
          console.log("veryfyBut after:", this.veryfyBut);
        })
    }
    this.fetchGender();
    this.checkDocStatus();
  }

  gbf() {
    this.gbSrv.gbf();
  }

  attachFile(event) {
    this.isValid = this.fileSrv.validateFile(event.target.files[0]);
    console.log("File Selected validation:", this.isValid);
    this.inputFile = event.target.files[0];
    console.log(this.inputFile.name);
    this.isSelected = true;
    this.IDFile.File_Original_Name = this.inputFile.name;
    if (this.isValid.size && this.isValid.type) {
      this.uploadIDFile();
    }
  }
  uploadIDFile() {
    console.log("identification component==> ", this.inputFile);
    this.fileSrv.Upload(this.inputFile, 'ID')
      .subscribe(
      (user) => {
        this.usrSrv.setStatusToComp('ID');
        // if(this.auth.isRenter()) this.router.navigate(['/user/register-pay']);
        // else this.router.navigate(['/broker/register-brokerage']);
        let disposable = this.dialogService.addDialog(RegisterDialogComponent, {
          title: this.auth.getName(),
          message: MESSAGES['TXT22']
        })
          .subscribe((confirm) => {
            console.log("Inside register user");
            //this.router.navigate([this.auth.getRoute('usersummary')]);
             this.getIdentification();

          },
          (close) => {
            console.log("you click close");
          });
      },
      (err) => {
        console.log("error ==> ", err);
      }
      );
  }

  deleteIDfile(doctype, msg) {
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: 'Identification File',
      message: msg
    })
      .subscribe((isConfirmed) => {
        //We get dialog result                    
        if (isConfirmed) {
          this.fileSrv.deleteUserFile(doctype)
            .subscribe(
            info => {
              console.log("successfully deleted Identification file for this user");
              // this.isDisabled = false;
              this.isUploaded = false;
              // this.browseBtn = true;
              console.log("isUploaded:", this.isUploaded);
              // console.log("isDisabled:",this.isDisabled);
              // console.log("browseBtn:",this.browseBtn);
              this.checkDocStatus();
            },
            (err) => {
              console.log(err);
            }
            )
        } else {
          console.log("you click cancel button");
        }
      });
  }

  skippedFun() {
    this.usrSrv.setStatusToSkip('ID');
    if (this.auth.isRenter()) this.router.navigate(['/user/register-pay']);
    else this.router.navigate(['/broker/register-brokerage']);
  }

  verifyDoc() {
    var data = {
      User_Gender: this.IDMdl.User_Gender
    }
    this.identificationServ.documentCheck(data)
      .subscribe(
      (info) => {
        console.log("User identification verification Data",info);
        this.checkDocStatus()
      },
      (err) => {
        console.log(err);
        this.uploadOnfido()
      }
      )
  }

  uploadOnfido() {
    this.identificationServ.uploadOnfido()
      .subscribe((data) => {
        console.log("uploadOnfido data:",data);
        this.checkDocStatus()
      },
      (err) => {
        console.log("error:", err + "==" + err.code);
        this.errorMessage = MESSAGES[err.code];
        console.log("errorMessage;",this.errorMessage);
        if (err.code == 'CCAC06') {
          this.profileCompletionDialog(MESSAGES['TXT15']);
        }

      })
  }

  fetchGender() {
    this.addressCheckService.getGender()
      .subscribe((data) => {
        this.IDMdl.User_Gender = data.User_Gender;
      }, (err) => {
        console.log(err)
      })
  }

  checkDocStatus() {
    this.identificationServ.getDocumentVerificationStatus()
      .subscribe((data) => {
         if (data && data.status) {
          console.log("check identification data:",data);
          console.log("check identification data status:",data.status);
         }
        // if(!data.status){
        //   this.errorMessage = '';
        //   this.errorMessage = MESSAGES['TXT40'];
        //   console.log("errorMessage;",this.errorMessage);
        // }else{
        //   this.errorMessage = '';
        // }
      },
      (err) => {
        console.log(err);
      })
  }

  profileCompletionDialog(msg) {
    let disposable = this.dialogService.addDialog(SuccessComponent, {
      message: msg
    })
      .subscribe((res) => {
        if (res) {
          console.log('closed')
        }
      });
  }
}
