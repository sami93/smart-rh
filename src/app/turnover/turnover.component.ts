import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '.././services/data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {Issue} from '.././models/issue';
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
import {AddDialogComponent} from '.././dialogs/add/add.dialog.component';
import {EditDialogComponent} from '.././dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from '.././dialogs/delete/delete.dialog.component';
import {DataSetService} from '../services/dataset.service';
import swal from 'sweetalert2';
import {PredictionService} from '../services/prediction.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as JSPdf from 'jspdf';
import {TeximateHover, TeximateOptions, TeximateOrder} from 'ng-teximate';
import {DatePipe} from '@angular/common';
import {UrlService} from '../services/url.service';

declare var jsPDF: any; // Important
@Component({
    selector: 'app-turnover',
    templateUrl: './turnover.component.html',
    styleUrls: ['./turnover.component.css']
})
export class TurnoverComponent implements OnInit {
    displayedColumns = ['Matricule', 'NOM', 'Civilite', 'SITUATION_FAMILIALE', 'DateEmbauche', 'actions'];
    exampleDatabase: DataService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    Matricule2: number;
    predict_value: any;
    name_value: any;
    column_names: any[];

    /* Declaration Adding  DataSet */
    addDataSetForm: FormGroup;
    Matricule = new FormControl('', Validators.required);
    NOM = new FormControl('', Validators.required);
    PRENOM = new FormControl('', Validators.required);
    Age = new FormControl('', Validators.required);
    Civilite = new FormControl('', Validators.required);
    DateEmbauche = new FormControl('', Validators.required);
    Date_de_Naissance = new FormControl('');
    SITUATION_FAMILIALE = new FormControl('', Validators.required);
    EXPERIENCE_AVANT_SOFRECOM = new FormControl('', Validators.required);
    EXPERIENCE_SOFRECOM = new FormControl('', Validators.required);
    EXPERIENCE_Totale = new FormControl('', Validators.required);
    Ecole = new FormControl('', Validators.required);
    Manager = new FormControl('', Validators.required);
    Pole = new FormControl('', Validators.required);
    Poste = new FormControl('', Validators.required);
    Seniorite = new FormControl('', Validators.required);
    Niveau_Academique = new FormControl('');
    Dernier_Employeur = new FormControl('');
    Eval_3_mois = new FormControl('');
    Fin_PE = new FormControl('');
    Mois = new FormControl('');
    Date_de_depot_de_demission = new FormControl('');
    DATE_SORTIE_Paie = new FormControl('');
    Date_de_sortie_RH = new FormControl('');
    Mois_de_sortie_RH = new FormControl('');
    ANNEE_SORTIE = new FormControl('');
    MOIS_SORTIE = new FormControl('');
    Moyenne_preavis = new FormControl('');
    Nombre_moyen_de_mois_de_preavis_Arrondi = new FormControl('');
    Nombre_moyen_de_mois_de_preavis = new FormControl('');
    Raison_de_depart = new FormControl('');
    Destination = new FormControl('');
    Nationalite = new FormControl('');
    Liste_Manager : any = [];
    Liste_Pole : any = [];
    Liste_Poste : any = [];
    Liste_Seniorite : any = [];
    Liste_SITUATION_FAMILIALE : any = [];
    Liste_Civilite : any = [];
    myStyle: object = {};
    myParams: object = {};
    width = 100;
    height = 100;
    /* End Declaration for Adding DataSet */
    text = 'TURNOVER  SOFRECOM ';

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
                private urlservice: UrlService) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;


    ngOnInit() {

this.datasetService.getListe_Manager().subscribe(res => {
        this.Liste_Manager = res;

    },
    err => {this.erreur(err, "erreur listeManager");})
        this.datasetService.getListe_Pole().subscribe(res => {
                this.Liste_Pole = res;

            },
            err => {this.erreur(err, "erreur Liste_Pole");})
        this.datasetService.getListe_Poste().subscribe(res => {
                this.Liste_Poste = res;

            },
            err => {this.erreur(err, "erreur Liste_Poste");})
        this.datasetService.getListe_Seniorite().subscribe(res => {
                this.Liste_Seniorite = res;

            },
            err => {this.erreur(err, "erreur Liste_Seniorite");})
        this.datasetService.getListe_SITUATION_FAMILIALE().subscribe(res => {
                this.Liste_SITUATION_FAMILIALE = res;

            },
            err => {this.erreur(err, "erreur Liste_SITUATION_FAMILIALE");})
        this.datasetService.getListe_Civilite().subscribe(res => {
                this.Liste_Civilite = res;

            },
            err => {this.erreur(err, "erreur Liste_Civilite");})
        this.addDataSetForm = this.formBuilder.group({
            Matricule: this.Matricule,
            NOM: this.NOM,
            PRENOM: this.PRENOM,
            Age: this.Age,
            Civilite: this.Civilite,
            DateEmbauche: this.DateEmbauche,
            SITUATION_FAMILIALE: this.SITUATION_FAMILIALE,
            Date_de_Naissance: this.Date_de_Naissance,
            EXPERIENCE_AVANT_SOFRECOM: this.EXPERIENCE_AVANT_SOFRECOM,
            EXPERIENCE_SOFRECOM: this.EXPERIENCE_SOFRECOM,
            EXPERIENCE_Totale: this.EXPERIENCE_Totale,
            Ecole: this.Ecole,
            Manager: this.Manager,
            Pole: this.Pole,
            Poste: this.Poste,
            Seniorite: this.Seniorite,
            Niveau_Academique: this.Niveau_Academique,
            Dernier_Employeur: this.Dernier_Employeur,
            Eval_3_mois: this.Eval_3_mois,
            Fin_PE: this.Fin_PE,
            Mois: this.Mois,
            Date_de_depot_de_demission: this.Date_de_depot_de_demission,
            DATE_SORTIE_Paie: this.DATE_SORTIE_Paie,
            Date_de_sortie_RH: this.Date_de_sortie_RH,
            Mois_de_sortie_RH: this.Mois_de_sortie_RH,
            ANNEE_SORTIE: this.ANNEE_SORTIE,
            MOIS_SORTIE: this.MOIS_SORTIE,
            Moyenne_preavis: this.Moyenne_preavis,
            Nombre_moyen_de_mois_de_preavis_Arrondi: this.Nombre_moyen_de_mois_de_preavis_Arrondi,
            Nombre_moyen_de_mois_de_preavis: this.Nombre_moyen_de_mois_de_preavis,
            Raison_de_depart: this.Raison_de_depart,
            Destination: this.Destination,
            Nationalite: this.Nationalite
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
                    value: '#1E90FF'
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

    addNew(issue: Issue) {
        const dialogRef = this.dialog.open(AddDialogComponent, {
            data: {issue: issue}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
                this.refreshTable();
            }
        });
    }

    getDataSets() {
        this.datasetService.getDataSets().subscribe(
            data => console.log(''),
            error => console.log(error),
            () => console.log('refreshed')
        );
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
                timer: 70000,
                onOpen: () => {
                    this.datasetService.predictionPerPerson(row).subscribe(

                        prediction => {

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

    generatePdf(Employee) {
        this.datasetService.getDataSetbyMatricule(Employee).subscribe(
            data => {
                const dataset = data;
                console.log(dataset)
                let doc = new JSPdf();
                doc.text(100, 10, 'SOFRECOM');
                doc.text(80, 20, 'Les Informations de ' + dataset.NOM).setFontSize(12);
                doc.setFont('arial');

                /*  var columns = [
                      {title: "ID", dataKey: "id"},
                      {title: "Name", dataKey: "name"},
                      {title: "Country", dataKey: "country"},
                      {title: "Country2", dataKey: "country2"},
                      {title: "Country3", dataKey: "country3"},
                      {title: "Country4", dataKey: "country4"},

                  ];
                  var rows = [
                      {"id": 1, "name": "Shaw", "country": "Tanzania", "country2": "Tanzania", "country3": "Tanzania", "country4": "Tanzania"},
                      {"id": 1, "name": "Shaw", "country": "Tanzania", "country2": "Tanzania", "country3": "Tanzania", "country4": "Tanzania"},
                      {"id": 1, "name": "Shaw", "country": "Tanzania", "country2": "Tanzania", "country3": "Tanzania", "country4": "Tanzania"}

                  ];

  // Only pt supported (not mm or in)
                  var doc2 = new jsPDF('p', 'pt');
                  doc2.autoTable(columns, rows, {
                      styles: {fillColor: [100, 255, 255]},
                      columnStyles: {
                          id: {fillColor: 255}
                      },
                      margin: {top: 60},
                      addPageContent: function(data) {
                          doc2.text("Header", 40, 30);
                      }
                  });
                  doc2.save('table.pdf');
                  */
                let item = {
                    'Matricule': dataset.Matricule,
                    'NOM': dataset.NOM + ' ' + dataset.PRENOM,
                    'Age': dataset.Age,
                    'Civilite': dataset.Civilite,
                    'DateEmbauche': dataset.DateEmbauche,
                    'Date_de_Naissance': dataset.Date_de_Naissance,
                    'SITUATION_FAMILIALE': dataset.SITUATION_FAMILIALE,
                    'EXPERIENCE_AVANT_SOFRECOM': dataset.EXPERIENCE_AVANT_SOFRECOM,
                    'EXPERIENCE_SOFRECOM': dataset.EXPERIENCE_SOFRECOM,
                    'EXPERIENCE_Totale': dataset.EXPERIENCE_Totale,
                    'Ecole': dataset.Ecole,
                    'Manager': dataset.Manager,
                    'Pole': dataset.Pole,
                    'Poste': dataset.Poste,
                    'Seniorite': dataset.Seniorite,
                    'Niveau_Academique': dataset.Niveau_Academique,
                    'Dernier_Employeur': dataset.Dernier_Employeur,
                    'Eval_3_mois': dataset.Eval_3_mois,
                    'Fin_PE': dataset.Fin_PE,
                    'Mois': dataset.Mois,
                    'Date_de_depot_de_demission': dataset.Date_de_depot_de_demission,
                    'Destination': dataset.Destination,
                    'Nationalite': dataset.Nationalite


                };

                var i = 30;

                for (let key in item) {

                    doc.text(50, 10 + i, key + ': ' + item[key]);

                    i += 10;

                }

                doc.save(dataset.Matricule + '.pdf');
            },
            erreur => console.log('erreur'));
    }

    public infoPersonne(dataset: any) {
        console.log(dataset);
        this.datasetService.getDataSetbyMatricule(dataset).subscribe(
            data => {
                const DataInfo = data;
                swal({
                    title: '  <span style="color:#6495ED;font-weight:bold">'
                    + DataInfo.NOM + ' ' + DataInfo.PRENOM + '</span> ',
                    showConfirmButton: true,
                    width: '825px',
                    html: `<center><table id="table" border=1 class="table table-bordered  table-striped">
        <tbody>
            <tr>
            <td>Matricule</td>
                <td>` + DataInfo.Matricule + `</td>
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

            },
            error => console.log(error),
            () => console.log('')
        );


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
        this.Matricule2 = dataset.Matricule;
        const dialogRef = this.dialog.open(EditDialogComponent, {

                data: {
                    _id: dataset._id,
                    Matricule: dataset.Matricule,
                    NOM: dataset.NOM,
                    PRENOM: dataset.PRENOM,
                    Civilite: dataset.Civilite,
                    Age: dataset.Age,
                    SITUATION_FAMILIALE: dataset.SITUATION_FAMILIALE,
                    DateEmbauche: dataset.DateEmbauche,
                    Date_de_Naissance: dataset.Date_de_Naissance,
                    EXPERIENCE_AVANT_SOFRECOM: dataset.EXPERIENCE_AVANT_SOFRECOM,
                    EXPERIENCE_SOFRECOM: dataset.EXPERIENCE_SOFRECOM,
                    EXPERIENCE_Totale: dataset.EXPERIENCE_Totale,
                    Ecole: dataset.Ecole,
                    Manager: dataset.Manager,
                    Pole: dataset.Pole,
                    Poste: dataset.Poste,
                    Seniorite: dataset.Seniorite,
                    Niveau_Academique: dataset.Niveau_Academique,
                    Dernier_Employeur: dataset.Dernier_Employeur,

                    Eval_3_mois: dataset.Eval_3_mois,
                    Fin_PE: dataset.Fin_PE,
                    Mois: dataset.Mois,
                    Date_de_depot_de_demission: dataset.Date_de_depot_de_demission,
                    DATE_SORTIE_Paie: dataset.DATE_SORTIE_Paie,
                    Date_de_sortie_RH: dataset.Date_de_sortie_RH,
                    Mois_de_sortie_RH: dataset.Mois_de_sortie_RH,

                    ANNEE_SORTIE: dataset.ANNEE_SORTIE,
                    MOIS_SORTIE: dataset.MOIS_SORTIE,


                    Moyenne_preavis: dataset.Moyenne_preavis,
                    Nombre_moyen_de_mois_de_preavis_Arrondi: dataset.Nombre_moyen_de_mois_de_preavis_Arrondi,
                    Nombre_moyen_de_mois_de_preavis: dataset.Nombre_moyen_de_mois_de_preavis,
                    Raison_de_depart: dataset.Raison_de_depart,
                    Destination: dataset.Destination,
                    Nationalite: dataset.Nationalite
                }
            })
        ;

        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                swal({
                    title: 'Succès de modification',
                    text: 'Informations de ' + dataset.Matricule + ' sont modifiées' ,
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'success'
                });
                // Part where we do frontend update, first you need to find record using id
                const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.Matricule === this.Matricule2);
                // Then you update that record using dialogData
                this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();

                // And lastly refresh table
                this.refreshTable();
            }
        });
    }

    deleteItem(i: number, dataset: any) {
        this.index = i;
        this.Matricule2 = dataset.Matricule;
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
                Matricule: dataset.Matricule,
                NOM: dataset.NOM,
                PRENOM: dataset.PRENOM


            }
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result === 1) {
                this.datasetService.deleteDataSet(dataset).subscribe(
                    res => {
                        swal({
                            title: 'Succès de suppression',
                            text: 'Informations de ' + dataset.Matricule + ' sont supprimées' ,
                            showConfirmButton: false,
                            timer: 2500,
                            type: 'error'
                        });

                        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.Matricule === this.Matricule2);
                        console.log(foundIndex);
                        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
                        this.refreshTable();

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

    getConvertedDate(convertDate) {

        var returnDate = "";
        var today = new Date(convertDate);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //because January is 0!
        var yyyy = today.getFullYear();
        //Interpolation date
        if (dd < 10) {
            returnDate += `0${dd}/`;
        } else {
            returnDate += `${dd}/`;
        }

        if (mm < 10) {
            returnDate += `0${mm}/`;
        } else {
            returnDate += `${mm}/`;
        }
        returnDate += yyyy;
        return returnDate;
    }

    addDataSet() {
        console.log(this.addDataSetForm.value);
        this.addDataSetForm.value.DateEmbauche = this.getConvertedDate(this.addDataSetForm.value.DateEmbauche)
        this.addDataSetForm.value.Date_de_Naissance = this.getConvertedDate(this.addDataSetForm.value.Date_de_Naissance)
        this.addDataSetForm.value.Date_de_depot_de_demission = this.getConvertedDate(this.addDataSetForm.value.Date_de_depot_de_demission)
        this.addDataSetForm.value.DATE_SORTIE_Paie = this.getConvertedDate(this.addDataSetForm.value.DATE_SORTIE_Paie)
        this.addDataSetForm.value.Date_de_sortie_RH = this.getConvertedDate(this.addDataSetForm.value.Date_de_sortie_RH)
        this.addDataSetForm.value.DEM = 0;

        //this.datePipe.transform(this.addDataSetForm.value.DateEmbauche, 'yyyy/MM/dd');

        this.datasetService.addDataSet(this.addDataSetForm.value).subscribe(
            res =>
            {let result = JSON.parse(res._body);

                swal({
                    title: 'Succès d\'ajout',
                    text: 'Employé ' + result.Matricule + ' ajouté' ,
                    showConfirmButton: false,
                    timer: 2500,
                    type: 'success'
                });

                console.log(JSON.parse(res._body));

                this.exampleDatabase.dataChange.value.push(JSON.parse(res._body));
                this.refreshTable();
            },
            error => {
                console.log(error);
                console.log('erreuuur');
                this.erreur(error, 'Error, Verify if Matricule is Unique');
            }
        );
    }






    public infoPersonne2(dataset: any) {
        console.log(dataset);
        this.datasetService.getDataSetbyMatricule(dataset).subscribe(
            data => {
                const DataInfo = data;
                swal({
                    title: '  <span style="color:#6495ED;font-weight:bold">'
                    + DataInfo.Name + ' ' + DataInfo.PRENOM + '</span> ',
                    showConfirmButton: true,
                    width: '825px',
                    html: `<center><table id="table" border=1 class="table table-bordered  table-striped">
        <tbody>
            <tr>
            <td>Matricule</td>
                <td>` + DataInfo.Matricule + `</td>
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

            },
            error => console.log(error),
            () => console.log('')
        );


    }
}


export class ExampleDataSource extends DataSource<Issue> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: Issue[] = [];
    renderedData: Issue[] = [];

    constructor(public _exampleDatabase: DataService,
                public _paginator: MatPaginator,
                public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Issue[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllIssues();

        return Observable.merge(...displayDataChanges).map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((issue: Issue) => {
                //    const searchStr = (issue.Name + issue.SITUATION_FAMILIALE + issue.DateEmbauche).toLowerCase();
                // const searchStr = (issue.Matricule.toString() +
                const searchStr = (issue.Matricule.toString() + issue.NOM).toLowerCase();
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
    sortData(data: Issue[]): Issue[] {
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
                case 'NOM':
                    [propertyA, propertyB] = [a.NOM, b.NOM];
                    break;
                case 'Civilite':
                    [propertyA, propertyB] = [a.Civilite, b.Civilite];
                    break;
                case 'SITUATION_FAMILIALE':
                    [propertyA, propertyB] = [a.SITUATION_FAMILIALE, b.SITUATION_FAMILIALE];
                    break;
                case 'DateEmbauche':
                    [propertyA, propertyB] = [a.DateEmbauche, b.DateEmbauche];
                    break;

            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
