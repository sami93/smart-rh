import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '.././services/data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {DeleteDialogComponent} from '.././dialoguser/delete/delete.dialog.component';
import {DataSetService} from '../services/dataset.service';
import swal from 'sweetalert2';
import {PredictionService} from '../services/prediction.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as JSPdf from 'jspdf';
import {TeximateHover, TeximateOptions, TeximateOrder} from 'ng-teximate';
import { DatePipe } from '@angular/common';
import {UserIssue} from '../models/userIssue';
import {UserService} from '../services/user.service';
import {EditDialogComponent} from '../dialoguser/edit/edit.dialog.component';
import {UrlService} from '../services/url.service';
declare var jsPDF: any; // Important
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserListComponent implements OnInit {
    displayedColumns = ['_id', 'username', 'email',  'role', 'actions'];
    exampleDatabase: DataService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    _id2: number;
    predict_value: any;
    name_value: any;
    column_names: any[];

    /* Declaration Adding  DataSet */
    addDataSetForm: FormGroup;
    username = new FormControl('', Validators.required);
    email = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);
    role = new FormControl('', Validators.required);
    roles = [

        {name: 'user', sound: 'user'},
        {name: 'admin', sound: 'admin'}
    ];
    myStyle: object = {};
    myParams: object = {};
    width = 100;
    height = 100;
    /* End Declaration for Adding DataSet */
    text = 'Gestion des utilisateurs';

    effectOptions: TeximateOptions = {
        type: 'letter',
        animation: {name: 'zoomInLeft', duration: 1000},
        word: {type: TeximateOrder.SHUFFLE, delay: 100},
        letter: {type: TeximateOrder.SHUFFLE, delay: 50}
    };

    hoverOptions: TeximateHover = {
        type: 'letter',
        in: 'zoomOutUp',
        out: 'bounceInDown'
    };
    constructor(public httpClient: HttpClient,
                public http: Http,
                public dialog: MatDialog,
                public dataService: DataService,
                public datasetService: DataSetService,
                public predictionservice: PredictionService,
                private router: Router,
                private formBuilder: FormBuilder,
                private datePipe: DatePipe,
                private userService: UserService,
                private urlservice: UrlService) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;


    ngOnInit() {
        this.addDataSetForm = this.formBuilder.group({
            username: this.username,
            email: this.email,
            password: this.password,
            role: this.role
        });

        this.myStyle = {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'z-index': -1,
            'top': 0,
            'left': 0,
            'right': 0,
            'bottom': 0,
        };

        this.myParams = {
            particles: {
                number: {
                    value: 100,
                },
                color: {
                    value: '#FF00FF'
                },
                shape: {
                    type: 'circle',
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: false,
                    }
                },
                size: {
                    value: 5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 5
                    }
                },
                move: {
                    enable: true,
                    speed: 5
                },
            }
        };
        this.loadData();
    }

    refresh() {
        this.loadData();
    }



    erreur(err, NameOfError) {
        swal(
            '' + NameOfError,
            '' + JSON.stringify(err),
            'error'
        )
    }

    startEdit(i: number, dataset: any) {
        this.index = i;
        this._id2 = dataset._id;
        const dialogRef = this.dialog.open(EditDialogComponent, {

                data: {
                    _id: dataset._id,
                    username: dataset.username,
                    email: dataset.email,
                    role: dataset.role

                }
            })
        ;

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                swal({
                    title: 'Succès de modification',
                    text: 'Informations de ' + dataset.username + ' sont modifiées' ,
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'success'
                });
                // Part where we do frontend update, first you need to find record using id
                const foundIndex = this.exampleDatabase.dataChangeUser.value.findIndex(x => x._id === this._id2);
                // Then you update that record using dialogData
                this.exampleDatabase.dataChangeUser.value[foundIndex] = this.dataService.getDialogData();

                // And lastly refresh table
                this.refreshTable();
                this.refresh();
            }
        });
    }

    deleteItem(i: number, dataset: any) {
        this.index = i;
        this._id2 = dataset.id;
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
                username: dataset.username,
                email: dataset.email,
                role: dataset.role

            }
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result === 1) {
                this.userService.deleteUser(dataset).subscribe(
                    res => {
                        swal({
                            title: 'Suppression de ' + dataset.username,
                            text: '',
                            type: 'error',
                            confirmButtonClass: 'btn btn-info',
                            buttonsStyling: false
                        });

                        const foundIndex = this.exampleDatabase.dataChangeUser.value.findIndex(x => x._id === this._id2);
                        console.log(foundIndex);
                        this.exampleDatabase.dataChangeUser.value.splice(foundIndex, 1);
                        this.refreshTable();
                        this.refresh();

                    },
                    error => console.log(error)
                );
            }
        });
    }

    private refreshTable() {
        // If there's no data in filter we do update using pagination, next page or previous page
        if (this.dataSource._filterChange.getValue() === '') {

            if (this.dataSource._paginator.pageIndex === 0) {
                this.dataSource._paginator.nextPage();
                this.dataSource._paginator.previousPage();
            } else {
                this.dataSource._paginator.previousPage();
                this.dataSource._paginator.nextPage();
            }
            // If there's something in filter, we reset it to 0 and then put back old value
        } else {
            this.dataSource.filter = '';
            this.dataSource.filter = this.filter.nativeElement.value;

        }
    }

    public loadData() {
        this.exampleDatabase = new DataService(this.httpClient, this.urlservice);
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    addDataSet() {

        this.addDataSetForm.value.role=this.addDataSetForm.value.role.name

        this.userService.register(this.addDataSetForm.value).subscribe(
            res => {let result = JSON.parse(res._body);

                swal({
                    title: 'Succès d\'ajout',
                    text: 'Utilisateur ' + result.username + ' ajouté' ,
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'success'
                });
                this.exampleDatabase.dataChangeUser.value.push(JSON.parse(res._body));
                this.refreshTable();
                this.refresh()
            },
            error => {
                console.log(error);
                console.log('erreuuur');
                this.erreur(error, 'Error, Verify if username is Unique');
            }
        );
    }




}

export class ExampleDataSource extends DataSource<UserIssue> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: UserIssue[] = [];
    renderedData: UserIssue[] = [];

    constructor(public _exampleDatabase: DataService,
                public _paginator: MatPaginator,
                public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<UserIssue[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChangeUser,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllUserIssues();

        return Observable.merge(...displayDataChanges).map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.dataUser.slice().filter((issue: UserIssue) => {
                //    const searchStr = (issue.Name + issue.SITUATION_FAMILIALE + issue.DateEmbauche).toLowerCase();
                // const searchStr = (issue.username.toString() +
                const searchStr = (issue._id.toString() + issue.username).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            // Sort filtered data
            const sortedData = this.sortData(this.filteredData.slice());
            // Grab the page's slice of the filtered sorted data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
            return this.renderedData;
        });
    }

    disconnect() {
    }


    /** Returns a sorted copy of the database data. */
    sortData(data: UserIssue[]): UserIssue[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case '_id':
                    [propertyA, propertyB] = [a._id, b._id];
                    break;
                case 'username':
                    [propertyA, propertyB] = [a.username, b.username];
                    break;
                case 'email':
                    [propertyA, propertyB] = [a.email, b.email];
                    break;
                case 'role':
                    [propertyA, propertyB] = [a.role, b.role];
                    break;


            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
