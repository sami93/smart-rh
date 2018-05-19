import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { UserListRoutes } from './user.routing';
import {UserListComponent} from './user.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {AddDialogComponent} from '../dialoguser/add/add.dialog.component';
import {DeleteDialogComponent} from 'app/dialoguser/delete/delete.dialog.component';
import {DataService} from '../services/data.service';
import {DataSetService} from '../services/dataset.service';
import {PredictionService} from '../services/prediction.service';
import {HttpModule} from '@angular/http';
import {ParticlesModule} from 'angular-particle';
import {TeximateModule} from 'ng-teximate';
import {UserService} from '../services/user.service';
import {EditDialogComponent} from '../dialoguser/edit/edit.dialog.component';
import {UrlService} from '../services/url.service';


@NgModule({
    declarations: [
        UserListComponent,
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(UserListRoutes),
        FormsModule,
        MdModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        ParticlesModule,
        TeximateModule

    ],

    entryComponents: [
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent
    ],
    providers: [
        DataService,
        DataSetService,
        PredictionService,
        DatePipe,
        UserService,
        UrlService
    ]
})

export class UserListModule {}
