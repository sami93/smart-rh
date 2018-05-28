import {AfterViewInit, Component, DoCheck, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';

import 'rxjs/add/operator/map';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../../services/data.service';
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

import swal from 'sweetalert2';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {PredictionService} from '../../../services/prediction.service';
import {DataSetService} from '../../../services/dataset.service';
import {Http, Response, URLSearchParams, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import {PredictionHistoryPerson} from '../../../models/predictionHistoryPerson';
import * as JSPdf from 'jspdf';
import {UrlService} from '../../../services/url.service';

@Component({
    selector: 'app-predictiondetail',
    templateUrl: './prediction_detail.component.html',
    styleUrls: ['./prediction_detail.component.scss'],
})



export class PredictionDetailComponent implements OnInit, OnDestroy, OnChanges {
    id: number;
    private sub: any;
    displayedColumns = ['predict_value', 'date_value', 'time_value', 'actions'];
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

    constructor(public httpClient: HttpClient,
                public dialog: MatDialog,
                public dataService: DataService,
                private auth: AuthService,
                private userService: UserService,
                private http: Http,
                private predictionservice: PredictionService,
                public dataSetService: DataSetService,
                private route: ActivatedRoute,
                private urlService: UrlService) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loadData();
            // In a real app: dispatch action to load the details here.
        });
    }

    ngOnChanges(changes: any) {


    }

    ngOnDestroy() {
        this.sub.unsubscribe();
     //   console.log(this.id);
    }


    refresh() {
        this.loadData();
    }

    addNew(issue: PredictionHistoryPerson) {
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
        this.exampleDatabase = new DataService(this.httpClient, this.urlService);
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, this.id);

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

    generatePdf() {
        this.predictionservice.getPredictionMatricule(this.id).subscribe(
            res => {

                let dataset = res.date_predict;
                console.log(dataset);
                console.log(dataset);
                let doc = new JSPdf();
                doc.text(100, 10, "SOFRECOM");
                doc.text(80, 20, "Les Informations de " + dataset[0].NOM + ' ' + dataset[0].PRENOM);
                for (var predict_history = 0; predict_history < dataset.length; predict_history++) {
                    doc.setFont("courier", "bold");
                    doc.setFontSize(15);
                    doc.text(60, 40, " Date : " + dataset[predict_history].date_value + "   Time : " + dataset[predict_history].time_value).setFontSize(12);
                    doc.setFont("arial", "normal");
                    let item = {
                        "Predict_value": dataset[predict_history].predict_value,
                        "Matricule": dataset[predict_history].Matricule,
                        "Age": dataset[predict_history].Age,
                        "Civilite": dataset[predict_history].Civilite,
                        "DateEmbauche": dataset[predict_history].DateEmbauche,
                        "Date_de_Naissance": dataset[predict_history].Date_de_Naissance,
                        "SITUATION_FAMILIALE": dataset[predict_history].SITUATION_FAMILIALE,
                        "EXPERIENCE_AVANT_SOFRECOM": dataset[predict_history].EXPERIENCE_AVANT_SOFRECOM,
                        "EXPERIENCE_SOFRECOM": dataset[predict_history].EXPERIENCE_SOFRECOM,
                        "EXPERIENCE_Totale": dataset[predict_history].EXPERIENCE_Totale,
                        "Ecole": dataset[predict_history].Ecole,
                        "Manager": dataset[predict_history].Manager,
                        "Pole": dataset[predict_history].Pole,
                        "Poste": dataset[predict_history].Poste,
                        "Seniorite": dataset[predict_history].Seniorite,
                        "Niveau_Academique": dataset[predict_history].Niveau_Academique,
                        "Dernier_Employeur": dataset[predict_history].Dernier_Employeur,
                        "Eval_3_mois": dataset[predict_history].Eval_3_mois,
                        "Fin_PE": dataset[predict_history].Fin_PE,
                        "Mois": dataset[predict_history].Mois,
                        "Date_de_depot_de_demission": dataset[predict_history].Date_de_depot_de_demission,
                        "Destination": dataset[predict_history].Destination,
                        "Nationalite": dataset[predict_history].Nationalite

                    };

                    var i = 50;
                    for (let key in item) {

                        doc.text(50, 10 + i, key + ": " + item[key]);

                        i += 10;

                    }

                    if (predict_history < dataset.length - 1) {
                        doc.addPage();
                        doc.text(10, 10, "Les Informations de " + this.id);
                    }
                }


                doc.save(this.id + '.pdf');
            },
            erreur => {}
        );

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
        const DataInfo = predict_name;
        console.log(predict_name);
        swal({
            title: '  <span style="color:#6495ED;font-weight:bold">'
            + this.id + '</span> ',
            showConfirmButton: true,
            width: '825px',
            html: `<center><table id="table" border=1 class="table table-bordered  table-striped">
        <tbody>
            <tr>
            <td>Matricule</td>
                <td>` + DataInfo.Matricule + `</td>
      </tr>
       <tr>
            <td>Valeur de prédiction</td>
                <td>` + DataInfo.predict_value + `</td>
      </tr>
        <tr>
            <td>Date de prédiction</td>
                <td>` + DataInfo.date_value + `</td>
      </tr>
         <tr>
            <td>Temps de prédiction</td>
                <td>` + DataInfo.time_value + `</td>
      </tr>  
            <tr>
            <td>Age</td>
                <td>` + DataInfo.Age + `</td>
      </tr>
       <tr>
            <td>Nationalite</td>
                <td>` + DataInfo.Nationalite + `</td>
      </tr>
         <tr>
            <td>Date_de_Naissance</td>
                <td>` + DataInfo.Date_de_Naissance + `</td>
      </tr>
       <tr>
            <td>Civilite</td>
                <td>` + DataInfo.Civilite + `</td>
      </tr>
        <tr>
            <td>SITUATION_FAMILIALE</td>
                <td>` + DataInfo.SITUATION_FAMILIALE + `</td>
      </tr>
             <tr>
            <td>DateEmbauche</td>
                <td>` + DataInfo.DateEmbauche + `</td>
      </tr>
     
      
      
    <tr>
            <td>EXPERIENCE_AVANT_SOFRECOM</td>
                <td>` + DataInfo.EXPERIENCE_AVANT_SOFRECOM + `</td>
      </tr>
        <tr>
            <td>EXPERIENCE_SOFRECOM</td>
                <td>` + DataInfo.EXPERIENCE_SOFRECOM + `</td>
      </tr>
           <tr>
            <td>EXPERIENCE_Totale</td>
                <td>` + DataInfo.EXPERIENCE_Totale + `</td>
      </tr>
         </tr>
           <tr>
            <td>Ecole</td>
                <td>` + DataInfo.Ecole + `</td>
      </tr>
         <tr>
            <td>Manager</td>
                <td>` + DataInfo.Manager + `</td>
      </tr>
   
  
      
  
         <tr>
            <td>Pole</td>
                <td>` + DataInfo.Pole + `</td>
      </tr>
           <tr>
            <td>Poste</td>
                <td>` + DataInfo.Poste + `</td>
      </tr>     
         </tr>
    
           <tr>
            <td>Seniorite</td>
                <td>` + DataInfo.Seniorite + `</td>
      </tr>  
        </tr>
           <tr>
            <td>Niveau_Academique</td>
                <td>` + DataInfo.Niveau_Academique + `</td>
      </tr>  
        </tr>
           <tr>
            <td>Dernier_Employeur</td>
                <td>` + DataInfo.Dernier_Employeur + `</td>
      </tr>  
      <tr>
            <td>Eval_3_mois</td>
                <td>` + DataInfo.Eval_3_mois + `</td>
      </tr>  
      
        <tr>
            <td>Fin_PE</td>
                <td>` + DataInfo.Fin_PE + `</td>
      </tr>  
          <tr>
            <td>Mois</td>
                <td>` + DataInfo.Mois + `</td>
      </tr>  
      
       <tr>
            <td>Date_de_depot_de_demission</td>
                <td>` + DataInfo.Date_de_depot_de_demission + `</td>
      </tr> 
      
            
       <tr>
            <td>DATE_SORTIE_Paie</td>
                <td>` + DataInfo.DATE_SORTIE_Paie + `</td>
      </tr> 
      
                  
       <tr>
            <td>Date_de_sortie_RH</td>
                <td>` + DataInfo.Date_de_sortie_RH + `</td>
      </tr> 
      
      
          <tr>
            <td>Mois_de_sortie_RH</td>
                <td>` + DataInfo.Mois_de_sortie_RH + `</td>
      </tr> 
      
      
       <tr>
            <td>ANNEE_SORTIE</td>
                <td>` + DataInfo.ANNEE_SORTIE + `</td>
      </tr> 
      
          <tr>
            <td>MOIS_SORTIE</td>
                <td>` + DataInfo.MOIS_SORTIE + `</td>
      </tr> 
      
        <tr>
            <td>Moyenne_preavis</td>
                <td>` + DataInfo.Moyenne_preavis + `</td>
      </tr> 
      
      
          <tr>
            <td>Nombre_moyen_de_mois_de_preavis_Arrondi</td>
                <td>` + DataInfo.Nombre_moyen_de_mois_de_preavis_Arrondi + `</td>
      </tr>
      
          <tr>
            <td>Nombre_moyen_de_mois_de_preavis</td>
                <td>` + DataInfo.Nombre_moyen_de_mois_de_preavis + `</td>
      </tr>
      
       <tr>
            <td>Raison_de_depart</td>
                <td>` + DataInfo.Raison_de_depart + `</td>
      </tr>
      
        <tr>
            <td>Destination</td>
                <td>` + DataInfo.Destination + `</td>
      </tr>
      

           <tr>
            <td>DEM</td>
                <td>` + DataInfo.DEM + `</td>
      </tr>
        
      
      
          </tbody>
</table>
</center>`,

            type: 'info'
        });
    }


}

export class ExampleDataSource extends DataSource<PredictionHistoryPerson> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: PredictionHistoryPerson[] = [];
    renderedData: PredictionHistoryPerson[] = [];

    constructor(public _exampleDatabase: DataService,
                public _paginator: MatPaginator,
                public _sort: MatSort,
                public MatriculePerson: any) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<PredictionHistoryPerson[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChangePredictionByMatricule,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];



        this._exampleDatabase.getPredictionByMatricule(this.MatriculePerson);

        return Observable.merge(...displayDataChanges).map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.dataPredictionByMatricule.slice().filter((issue: PredictionHistoryPerson) => {
                const searchStr = (issue.date_value.toString()).toLowerCase();
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
    sortData(data: PredictionHistoryPerson[]): PredictionHistoryPerson[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'predict_value':
                    [propertyA, propertyB] = [a.predict_value, b.predict_value];
                    break;
                case 'date_value':
                    [propertyA, propertyB] = [a.date_value, b.date_value];
                    break;
                case 'time_value':
                    [propertyA, propertyB] = [a.time_value, b.time_value];
                    break;

            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}