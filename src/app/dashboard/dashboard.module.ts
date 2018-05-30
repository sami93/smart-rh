import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import {AmChartsModule} from '@amcharts/amcharts3-angular';
import {DataService} from '../services/data.service';
import {DataSetService} from '../services/dataset.service';
import {PredictionService} from '../services/prediction.service';
import {HttpModule} from '@angular/http';
import {TeximateModule} from 'ng-teximate';
import {ParticlesModule} from 'angular-particle';
import {HttpClientModule} from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MdModule,
        MaterialModule,
        AmChartsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        ParticlesModule,
        TeximateModule,
        MatDatepickerModule
    ],
    declarations: [DashboardComponent],
    providers: [
        DataService,
        DataSetService,
        PredictionService,
        DatePipe
    ]
})

export class DashboardModule {}
