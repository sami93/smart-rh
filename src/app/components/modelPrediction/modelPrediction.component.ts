import { Component } from '@angular/core';

import {Http, RequestOptions, Response, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import swal from "sweetalert2";
import {UrlService} from "../../services/url.service";
declare var $: any;

@Component({
    selector: 'app-modelPrediction',
    templateUrl: 'modelPrediction.component.html',
    styleUrls: ['./modelPrediction.component.css']

})

export class ModelPredictionComponent {
    Nomfichier: string;
    public headers = new Headers({'Accept': '*/*', 'X-Requested-With': 'XMLHttpRequest'})
    public options = new RequestOptions({headers: this.headers});
    constructor(  private http: Http, private urlservice : UrlService){}
    fileChange(event) {


        swal({
            title: 'Chargement du Modèle ...',
            text: 'Il va se fermer en quelques secondes.',
            timer: 7000,
            onOpen: () => {
                const files = event.target.files;
                if (files.length > 0) {
                    let formData: FormData = new FormData();
                    for (let file of files) {
                        this.Nomfichier = file.name;
                        formData.append('dataset_file', file, file.name);
                    }


                    //  source_frames:["titanic_csv.csv"]


                    this.http.post(this.urlservice.url_Prediction + '/import', formData, this.options)

                        .catch(error => Observable.throw(error))
                        .subscribe(
                            ImportResult => {
                                this.http.get(this.urlservice.url_Prediction + '/Preprocessing_train')

                                    .catch(error => Observable.throw(error))
                                    .subscribe(
                                        Preprocessing_trainResult => {
                                            this.http.get(this.urlservice.url_Prediction + '/split')

                                                .catch(error => Observable.throw(error))
                                                .subscribe(
                                                    splitResult => {

                                                        this.http.get(this.urlservice.url_Prediction + '/Model')

                                                            .catch(error => Observable.throw(error))
                                                            .subscribe(
                                                                ModelResult => {

                                                                    swal({
                                                                        title: 'Succès',
                                                                        text: 'Mise à jour du Modèle',
                                                                        type: 'success',
                                                                        confirmButtonClass: 'btn btn-success',
                                                                        buttonsStyling: false
                                                                    });
                                                                },
                                                                error => {
                                                                    console.log(error);
                                                                    this.erreur(error, 'Model Error');
                                                                }
                                                            );
                                                    },
                                                    error => {
                                                        console.log(error);
                                                        this.erreur(error, 'split Error');
                                                    }
                                                );

                                        },
                                        error => {
                                            console.log(error);
                                            this.erreur(error, 'Preprocessing_train Error');
                                        }
                                    );

                            },
                            error => {
                                console.log(error);
                                this.erreur(error, 'Import Error');
                            }
                        );
                }
                swal.showLoading()
            }
        }).then((result) => {

            //result.dismiss === 0

        });









    }
    erreur(err, NameOfError) {
        swal(
            '' + NameOfError,
            '' + JSON.stringify(err),
            'error'
        )
    }
}
