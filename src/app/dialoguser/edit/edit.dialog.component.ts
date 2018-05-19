import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FormControl, Validators} from '@angular/forms';
import {PredictionService} from '../../services/prediction.service';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {DataSetService} from '../../services/dataset.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: '../../dialoguser/edit/edit.dialog.html',
  styleUrls: ['../../dialoguser/edit/edit.dialog.css']
})
export class EditDialogComponent {

  constructor( public http: Http,
               public dialog: MatDialog,
               public datasetService: DataSetService,
               public predictionservice: PredictionService,
               private router: Router,
               public dialogRef: MatDialogRef<EditDialogComponent>,
              public userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService) {

  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
      console.log(this.data)
      this.userService.editUser(this.data).subscribe(
          res => {
              console.log(this.data)
              this.dataService.updateUserIssue(this.data);

              console.log(res);
          },
          error => console.log(error)
      );

  }
}
