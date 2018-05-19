import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsComponent } from './buttons/buttons.component';
import { ComponentsRoutes } from './components.routing';
import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';
import {PredictionComponent} from './prediction/prediction.component';
import {MdModule} from '../md/md.module';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '../app.module';
import {HttpClientModule} from '@angular/common/http';
import {DataSetService} from '../services/dataset.service';
import {PredictionService} from '../services/prediction.service';
import {DataService} from '../services/data.service';
import {PredictionDetailComponent} from './prediction/prediction_details/prediction_detail.component';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ComponentsRoutes),
      FormsModule,
      MdModule,
      MaterialModule,
      ReactiveFormsModule,
      HttpClientModule,
      HttpModule
  ],
  declarations: [
      ButtonsComponent,
      GridSystemComponent,
      IconsComponent,
      NotificationsComponent,
      PanelsComponent,
      SweetAlertComponent,
      TypographyComponent,
      PredictionComponent,
      PredictionDetailComponent
  ],
    providers: [
        DataService,
        DataSetService,
        PredictionService
    ]
})

export class ComponentsModule {}
