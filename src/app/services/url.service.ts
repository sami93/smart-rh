import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class UrlService {
    //  url = 'http://84.39.44.181:3000';
    // url ='http://192.168.1.13:3000';
    url = 'http://localhost:3000';
    url_Prediction = 'http://localhost:5002';
}
