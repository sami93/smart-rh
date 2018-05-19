import {Routes} from '@angular/router';

import {ButtonsComponent} from './buttons/buttons.component';
import {SweetAlertComponent} from './sweetalert/sweetalert.component';
import {PredictionComponent} from './prediction/prediction.component';
import {PredictionDetailComponent} from './prediction/prediction_details/prediction_detail.component';


export const ComponentsRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'buttons',
            component: ButtonsComponent
        }]
    },
   {
        path: '',
        children: [{
            path: 'prediction',
            component: PredictionComponent,
            children: [{
                path: ':id',
                component: PredictionDetailComponent
            }]
        }]
    }, {
        path: '',
        children: [{
            path: 'sweet-alert',
            component: SweetAlertComponent
        }]
    }
];
