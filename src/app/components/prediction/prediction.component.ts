import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {DataService} from '../../services/data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {PredictionIssue} from '../../models/PredictionIssue';
import swal from 'sweetalert2';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {PredictionService} from '../../services/prediction.service';
import {DataSetService} from '../../services/dataset.service';
import {Http, Response, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import {Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import {UrlService} from '../../services/url.service';


@Component({
    selector: 'app-prediction',
    templateUrl: './prediction.component.html',
    styleUrls: ['./prediction.component.scss']
})


export class PredictionComponent implements OnInit {
    displayedColumns = ['Matricule', 'actions'];
    exampleDatabase: DataService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id2: number;
    predict_names: any[];
    predict_value: any;
    name_value: any;
    today = new Date();
    dd = this.today.getDate();
    mm = this.today.getMonth() + 1;
    yyyy = this.today.getFullYear();
    datefull: string;
    d: string;
    m: string;
    isLoading = true;
    column_names: any  [];
    show = false;

    constructor(public httpClient: HttpClient,
                public dialog: MatDialog,
                public dataService: DataService,
                private auth: AuthService,
                private userService: UserService,
                private http: Http,
                private predictionservice: PredictionService,
                private dataSetService: DataSetService,
                private router: Router,
                private urlservice: UrlService) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.loadData();
    }

    refresh() {
        this.loadData();
    }

    addNew(issue: PredictionIssue) {
    }

    startEdit() {
    }

    deleteItem() {
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

    /* callChild_v2(predict_name) {
        console.log('parent');


        console.log(predict_name);
        console.log('*******************')
        this.http.get('/api/datasetsMat/' + predict_name.Matricule)
            .map(this.extractData3)
            .subscribe(NamePrediciton => {
                predict_name['Name'] = NamePrediciton.Name;
                this.predictionservice.predict_detail = predict_name;
                this.child.ngOnChanges();
            }, erreurMat => {
                console.log(erreurMat)
            });


    } */

    /* callChild_v1(predict_name) {
         console.log('parent');


         console.log(predict_name);
         console.log('*******************')
         this.predictionservice.predict_detail = predict_name;
         this.child.ngOnChanges();

     }

 */
    PredictionTensorflow(predict_name) {
        console.log(predict_name.Matricule);
        this.dataSetService.getDataSetbyMatricule(predict_name).subscribe(
            getDataSetbyNameResult => {
                const headers = new Headers({'Content-Type': 'application/json'});
                const options = new RequestOptions({headers: headers});
                console.log(getDataSetbyNameResult);
                this.http.post('http://localhost:12345/import_prediction2', getDataSetbyNameResult, options)
                    .subscribe(res => {

                            this.http.get('http://localhost:12345/Preprocessing_train')
                                .subscribe(res2 => {
                                        console.log(res2);
                                        this.http.get('http://localhost:12345/Prediction')
                                            .subscribe(res3 => {

                                                    console.log(res3);
                                                },
                                                erreur3 => {
                                                    console.log(erreur3);
                                                }
                                            )
                                        ;

                                    },
                                    erreur2 => {
                                        console.log(erreur2)
                                    });
                            console.log(res);
                        },
                        erreur => {
                            console.log(erreur);
                        });
            },
            error => {
                console.log(error);
            });
    }

    TensorflowPredictionPerPerson(row) {
        swal({
            title: 'Êtes-vous sûr ?',
            text: 'Voulez-vous effectuer la prédiction ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(() => {

            swal({
                title: 'Chargement Prédiction ...',
                text: 'Il va se fermer en quelques secondes.',
                timer: 7000,
                onOpen: () => {
                    this.router.navigate(['/components/prediction']);
                    this.dataSetService.predictionPerPerson(row).subscribe(

                        prediction => {
                            this.router.navigate(['/components/prediction', row.Matricule]);

                            console.log(prediction)
                            swal({
                                title: 'Prédiction de ' + row.Matricule,
                                text: '= ' + prediction.predict_value + '   date : ' + prediction.date_value + ' | ' + prediction.time_value,
                                type: 'success',
                                confirmButtonClass: 'btn btn-success',
                                buttonsStyling: false
                            });
                            this.router.navigate(['/components/prediction', row.Matricule]);
                        },
                        erreur => {
                            this.erreur(erreur, 'Prediction erreur')
                        });
                    swal.showLoading()
                }
            }).then((result) => {

                //result.dismiss === 0

            });




        }, (dismiss) => {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
                swal({
                    title: 'Annulé',
                    text: '',
                    type: 'error',
                    confirmButtonClass: 'btn btn-info',
                    buttonsStyling: false
                });
            }
        }).catch(swal.noop);


    }





    erreur(err, NameOfError) {
        swal(
            '' + NameOfError,
            '' + JSON.stringify(err),
            'error'
        )
    }








    showInfo(predict_name) {
        this.predictionservice.getPrediction(predict_name)
            .subscribe(predictions => {
                console.log(predictions.name)
                console.log(typeof predictions.date_predict)
                console.log(predictions.date_predict[0].date_value)

                // Calling the DT trigger to manually render the table
                swal({
                    title: '  <span style="color:#6495ED;font-weight:bold">'
                    + predictions.name + '</span> ',
                    showConfirmButton: true,
                    html: `<center><table id="table" border=1 class="table .table-bordered">
        <thead>
            <tr>
            <th>Predict</th>
                <th>DATE</th>
           
               
            </tr>
        </thead>
        <tbody>
            <tr>
               <td>` + predictions.date_predict[predictions.date_predict.length - 1].predict_value + `</td>
               <td>` + predictions.date_predict[predictions.date_predict.length - 1].date_value + `</td>
              
              
            </tr>
          </tbody>
</table>
</center>`,

                    type: 'info'
                })
            });


    }

    showHistorique(Employee) {
        this.router.navigate(['/components/prediction', Employee.Matricule]);
    }
}


export class ExampleDataSource extends DataSource<PredictionIssue> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: PredictionIssue[] = [];
    renderedData: PredictionIssue[] = [];

    constructor(public _exampleDatabase: DataService,
                public _paginator: MatPaginator,
                public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<PredictionIssue[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChangePrediction,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllPredictionIssue();

        return Observable.merge(...displayDataChanges).map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.dataPrediction.slice().filter((issue: PredictionIssue) => {
                const searchStr = (issue.Matricule.toString()).toLowerCase();
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
    sortData(data: PredictionIssue[]): PredictionIssue[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'Matricule':
                    [propertyA, propertyB] = [a.Matricule, b.Matricule];
                    break;

            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
