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
                private router: Router) {
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
        this.exampleDatabase = new DataService(this.httpClient);
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

            this.router.navigate(['/components/prediction']);
            this.dataSetService.predictionPerPerson(row).subscribe(
                prediction => {
                    this.router.navigate(['/components/prediction', row.Matricule]);
                    swal({
                        title: 'Prédiction de ' + row.Matricule,
                        text: 'Succès.',
                        type: 'success',
                        confirmButtonClass: 'btn btn-success',
                        buttonsStyling: false
                    });
                },
                erreur => {
                    console.log(erreur);
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

    tensorflow() {
        this.http.get('http://localhost:5000/Prediction')
            .subscribe(res => {

                    const res2 = JSON.parse((<any>res)._body);
                    res = JSON.parse(res2)
                    console.log(res);
                },
                error => {
                    console.log(error);
                });


    }

    predictPerson(predict_name) {
        console.log(predict_name.Matricule);
        this.dataSetService.getDataSetbyMatricule(predict_name).subscribe(
            getDataSetbyNameResult => {
                console.log('*******************');
                console.log(getDataSetbyNameResult);
                this.predictionservice.PredictionPerPerson(getDataSetbyNameResult).subscribe(
                    PathFileResult => {
                        console.log('PathFile');
                        const File = this.predictionservice.pathFile;
                        // const File = PathFileResult._body + '/predict.csv';
                        // const File="/home/ubuntu/h2o/titanic3_csv.csv";
                        console.log(File);

                        // ******** GET 3/IMPORT with pathFile From server
                        this.http.get(this.predictionservice.url + '/3/ImportFiles?path=' + File)
                            .map(res => res.json())
                            .catch(error => Observable.throw(error))
                            .subscribe(ImportFile => {
                                    const DestinationFrame = ImportFile.destination_frames[0];
                                    console.log('Destination Frame');
                                    console.log(DestinationFrame);
                                    // this.predictionservice.Parse_predictPerPersonCsv(DestinationFrame);
                                    this.Parse_predictPerPersonCsv(predict_name, DestinationFrame);
                                },
                                error2 => {

                                    // ******** Import Error
                                    console.log(error2);
                                    this.erreur(error2, 'Import Error');
                                });

                    },
                    error => {
                        // ******** Error GenerateCsvFile
                        console.log(error);
                        this.erreur(error, 'GenerateCsvFile Error ');
                    }
                );
            }, errorGetName => {
                // ******** Error GenerateCsvFile
                console.log(errorGetName);
                this.erreur(errorGetName, 'errorGetName Error ');
            }
        );
    }

    erreur(err, NameOfError) {
        swal(
            '' + NameOfError,
            '' + JSON.stringify(err),
            'error'
        )
    }

    private extractData3(res: Response) {

        const body = res.json();


        return body || {};
    }

    Parse_predictPerPersonCsv(predict_name, PostFileResult) {
        const parseSetup = new URLSearchParams();
        parseSetup.append('source_frames', '["' + PostFileResult + '"]');
        this.http.post(this.predictionservice.url + '/3/ParseSetup', parseSetup)
            .map(res => res.json())
            .catch(error2 => Observable.throw(error2))
            .subscribe(
                ParseSetupResult => {
                    console.log(PostFileResult);
                    console.log(ParseSetupResult.column_names);
                    this.column_names = ParseSetupResult.column_names;
                    //console.log(ParseSetupResult.column_types.length);
                    //console.log(ParseSetupResult.column_types[length]);
                    //console.log(typeof ParseSetupResult.column_types[ParseSetupResult.column_types.length - 1]);
                    console.log('*********');
                    console.log(ParseSetupResult.destination_frame);
                    const parse = new URLSearchParams();
                    parse.append('destination_frame', ParseSetupResult.destination_frame);
                    parse.append('source_frames', '["' + PostFileResult + '"]');
                    // parse.append('source_frames', '["' + this.Nomfichier + '"]');
                    parse.append('parse_type', ParseSetupResult.parse_type);
                    parse.append('separator', ParseSetupResult.separator);
                    parse.append('number_columns', ParseSetupResult.number_columns);
                    parse.append('single_quotes', ParseSetupResult.single_quotes);
                    // convert tab object to string with JSON.stringify()
                    parse.append('column_names', JSON.stringify(ParseSetupResult.column_names));
                    /* the type of the predict variable (last item in column_types table) must be Enum */
                    // ParseSetupResult.column_types[ParseSetupResult.column_types.length - 1] = 'Enum';
                    /* for (var index_column_name = 0; index_column_name < ParseSetupResult.column_names.length; index_column_name++) {
                     if (ParseSetupResult.column_names[index_column_name] === 'EXPERIENCE_AVANT_SOFRECOM') {
                     ParseSetupResult.column_types[index_column_name] = 'int';
                     }
                     if (ParseSetupResult.column_names[index_column_name] === 'EXPERIENCE_SOFRECOM') {
                     ParseSetupResult.column_types[index_column_name] = 'int';

                     }
                     if (ParseSetupResult.column_names[index_column_name] === 'EXPERIENCE_Totale') {
                     ParseSetupResult.column_types[index_column_name] = 'int';
                     }
                     if (ParseSetupResult.column_names[index_column_name] === 'Age') {
                     ParseSetupResult.column_types[index_column_name] = 'int';
                     }

                     }
                     */
                    /* convert tab object to string with JSON.stringify() */
                    parse.append('column_types', JSON.stringify(ParseSetupResult.column_types));
                    parse.append('check_header', ParseSetupResult.check_header);
                    parse.append('delete_on_done', 'true');
                    parse.append('chunk_size', ParseSetupResult.chunk_size);
                    /* format of parse */
                    /*destination_frame:Key_Frame__titanic_csv.hex
                     source_frames:["titanic_csv.csv"]
                     parse_type:CSV
                     separator:59
                     number_columns:15
                     single_quotes:false
                     column_names:["pclass","survived","name","sex","age","sibsp","parch","ticket","fare","cabin","embarked","boat","body","home.dest","etat"]
                     column_types:["Numeric","Numeric","String","Enum","Numeric","Numeric","Numeric","Numeric","Enum","Enum","Enum","Numeric","Numeric","Enum","Enum"]
                     check_header:1
                     delete_on_done:true
                     chunk_size:4194304 */

                    /*   sami ghorbel */

                    this.http.post(this.predictionservice.url + '/3/Parse', parse)
                        .map(res => res.json())
                        .catch(error3 => Observable.throw(error3))
                        .subscribe(
                            ParseResult => {
                                console.log('**********');
                                const DataSet = ParseResult.destination_frame.name;
                                // const DataSet = ParseSetupResult.destination_frame;
                                /* **********Choose Model ******* */
                                console.log('Choose a Model');
                                this.http.get(this.predictionservice.url + '/3/Models')
                                    .map(this.extractData)
                                    .subscribe(models => {
                                            var ModelNameObject = {};
                                            const FirstModel = models[0].model_id.name;
                                            //console.log(this.models);

                                            for (const model of models) {
                                                const id_Model = model.model_id;
                                                ModelNameObject[id_Model.name] = id_Model.name;
                                            }
                                            console.log(typeof FirstModel);
                                            console.log(FirstModel);

                                            swal({
                                                title: 'Select Model',
                                                input: 'select',
                                                inputOptions: ModelNameObject,
                                                inputPlaceholder: 'Select Model',
                                                inputValue: FirstModel,
                                                showCancelButton: false,
                                            }).then((ModelResult) => {
                                                const ModelSelected = ModelResult;
                                                swal({
                                                    title: 'Model <span style="color:#6495ED;font-weight:bold">'
                                                    + ModelResult + '</span> Selected',
                                                    timer: 1000,
                                                    showConfirmButton: false,
                                                    type: 'success'
                                                }).catch(swal.noop);

                                                /* do prediction */
                                                this.insert_prediction(predict_name, ModelSelected, DataSet);

                                            })


                                        },
                                        error4 => {
                                            this.erreur(error4, 'Model Erreur');
                                        }
                                    );


                            },
                            error3 => {
                                console.log(error3);
                                this.erreur(error3, 'Parse Error');
                            });
                },
                error2 => {
                    console.log(error2);
                    this.erreur(error2, 'ParseSetup Error');
                });

    }


    private extractData(res: Response) {

        const body = res.json();
        const sami = body.models;


        return sami || {};
    }

    private extractData2(res: Response) {

        const body = res.json();
        const sami = body.frames;


        return sami || {};
    }

    insert_prediction(predict_name, NameOfModel, NameOfFrame) {
        const predict_id = 'predict_id';
        const data = new URLSearchParams();
        data.append('predictions_frame', predict_id);
        if (this.dd < 10) {
            this.d = '0' + this.dd;
        }

        if (this.mm < 10) {
            this.m = '0' + this.mm;
        }
        this.datefull = this.dd + '/' + this.m + '/' + this.yyyy;

        this.http.post(this.predictionservice.url + '/3/Predictions/models/' + NameOfModel + '/frames/' + NameOfFrame, data)
            .subscribe(PredictionResult => {
                swal({
                    imageUrl: 'assets/logo.png',
                    title: '<br>Loading....',
                    timer: 1000,
                    type: 'success',
                    showConfirmButton: false

                }).then((x) => {

                }).catch(swal.noop);
                const combined = new URLSearchParams();
                this.predictionservice.combined_prediction = 'combined-' + predict_id;
                combined.append('ast', '(assign ' + this.predictionservice.combined_prediction + ' (cbind ' + predict_id + ' ' + NameOfFrame + '))');
                this.http.post(this.predictionservice.url + '/99/Rapids', combined)
                    .subscribe(CombinedResult => {
                        /*swal(
                         'Prediction added!',
                         '',
                         'success'
                         );*/
                        this.http.get(this.predictionservice.url + '/3/Frames/' + this.predictionservice.combined_prediction + '?column_offset=0&column_count=20')
                            .map(this.extractData2)
                            .subscribe(frames => {
                                console.log(frames[0].columns);
                                var InfoPers = {};

                                for (const column_frame of  frames[0].columns) {
                                    console.log(column_frame);

                                    if (column_frame.label === 'predict') {
                                        this.predict_value = column_frame.data[0];
                                        InfoPers[column_frame.label] = column_frame.data[0];
                                    }
                                    if (column_frame.label === 'Name') {
                                        this.name_value = column_frame.domain[column_frame.data[0]];

                                    }

                                    for (const column_name of this.column_names) {
                                        if (column_frame.label === column_name) {
                                            if (column_frame.type === 'int') {
                                                InfoPers[column_name] = column_frame.data[0];
                                            }
                                            if (column_frame.type === 'real') {
                                                InfoPers[column_name] = column_frame.data[0];
                                            }
                                            if (column_frame.type === 'enum') {
                                                InfoPers[column_name] = column_frame.domain[column_frame.data[0]];
                                            }
                                            if (column_frame.type === 'time') {
                                                const dateToConvert = new Date(column_frame.data[0]);
                                                const ConvertedDate = dateToConvert.getDate() + '/' + (dateToConvert.getMonth() + 1) + '/'
                                                    + dateToConvert.getFullYear();
                                                InfoPers[column_name] = ConvertedDate;
                                            }
                                        }

                                    }


                                }

                                console.log(this.predict_value);
                                const todayTime = new Date();

                                const hour = ('0' + todayTime.getHours()).slice(-2);
                                const minute = ('0' + todayTime.getMinutes()).slice(-2);
                                const sec = ('0' + todayTime.getSeconds()).slice(-2);
                                const timeNow = hour + ':' + minute + ':' + sec;


                                const year = ('0' + todayTime.getFullYear()).slice(-2);
                                const month = ('0' + (todayTime.getMonth() + 1)).slice(-2);
                                const day = ('0' + todayTime.getDate()).slice(-2);
                                const datefull = day + '/' + month + '/' + year;
                                const obj = {
                                    'predict': this.predict_value,
                                    'name': this.name_value,
                                    'date': datefull,
                                    'time': timeNow
                                };
                                InfoPers['date'] = datefull;
                                InfoPers['time'] = timeNow;
                                console.log('obj');
                                console.log(obj);
                                console.log(InfoPers);
                                this.predictionservice.editPrediction(InfoPers).subscribe(
                                    EditPerPersonResult => {
                                        console.log('sami');
                                        /* DELETE*/
                                        this.http.delete(this.predictionservice.url + '/3/Frames/' + 'predict_id')
                                            .subscribe(PredictDelete => {
                                            }, errorPredictDelete => {
                                                console.log(errorPredictDelete);
                                            });


                                        this.http.delete(this.predictionservice.url + '/3/Frames/' + NameOfFrame)
                                            .subscribe(DeleteFrame => {
                                                    this.http.delete(this.predictionservice.url + '/3/Frames/' + this.predictionservice.combined_prediction)
                                                        .subscribe(DeleteFrameCombined => {
                                                                console.log('DeleteFrameCombined');
                                                                console.log(DeleteFrameCombined);
                                                                //  this.callChild_v2(predict_name);
                                                                console.log('sami');
                                                            },
                                                            errordeletecombined => {
                                                                console.log(errordeletecombined);
                                                            });
                                                },
                                                errordelete => {
                                                    console.log(errordelete);
                                                });


                                    },
                                    EditPerPersonError => {
                                        console.log(EditPerPersonError.json());
                                        this.erreur(EditPerPersonError, 'errorFrame');
                                    }
                                );

                            }, errorFrame => {
                                console.log(errorFrame.json());
                                this.erreur(errorFrame, 'errorFrame');
                            });
                        /*
                         let n = 1;
                         setTimeout(function () {
                         console.log('timeouuuuuut');
                         n = n + 10000;
                         }, 100000);
                         */


                    }, errorCombined => {
                        console.log(errorCombined.json());
                        this.erreur(errorCombined, 'errorCombined');
                    });


            }, errorPrediction => {
                console.log(errorPrediction.json());
                this.erreur(errorPrediction, 'errorPrediction');
            });
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
