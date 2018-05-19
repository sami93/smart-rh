import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UrlService} from './url.service';

@Injectable()
export class DataSetService {
    private url = 'http://84.39.44.181:3000';
    private headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
    private options = new RequestOptions({headers: this.headers});

    constructor(private http: Http, private urlservice : UrlService) {
    }

    getDataSets(): Observable<any> {
        return this.http.get(this.urlservice.url  + '/api/dataset').map(res => res.json());
    }

    countDataSet(): Observable<any> {
        return this.http.get(this.urlservice.url  +'/api/dataset/count').map(res => res.json());
    }

    count_Seniorite(): Observable<any> {
        return this.http.get(this.urlservice.url  + '/api/dataset/count_Seniorite').map(res => res.json());
    }

    count_SITUATION_FAMILIALE(): Observable<any> {
        return this.http.get(this.urlservice.url  + '/api/dataset/count_SITUATION_FAMILIALE').map(res => res.json());
    }
    addDataSet(dataset): Observable<any> {
        console.log(JSON.stringify(dataset));
        console.log(JSON.stringify(this.options));
        return this.http.post(this.urlservice.url  +'/api/dataset', JSON.stringify(dataset), this.options);
    }

    getDataSet(dataset): Observable<any> {
        return this.http.get(this.urlservice.url  +`/api/dataset/${dataset._id}`).map(res => res.json());
    }

    getDataSetbyName(dataset): Observable<any> {
        return this.http.get(this.urlservice.url  +`/api/datasets/${dataset.name}`).map(res => res.json());
    }


    getDataSetbyMatricule(dataset): Observable<any> {
        return this.http.get(this.urlservice.url  +`/api/datasetsMat/${dataset.Matricule}`).map(res => res.json());
    }

    predictionPerPerson(dataset): Observable<any> {
        return this.http.get(this.urlservice.url  +`/api/predictionPerPerson/${dataset.Matricule}`).map(res => res.json());
    }

    editDataSet(dataset): Observable<any> {
        return this.http.put(this.urlservice.url  + `/api/dataset/${dataset._id}`, JSON.stringify(dataset), this.options);
    }

    deleteDataSet(dataset): Observable<any> {
        return this.http.delete(this.urlservice.url  + `/api/dataset/${dataset.Matricule}`, this.options);
    }

}
