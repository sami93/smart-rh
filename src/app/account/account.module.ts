import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AccountComponent} from './account.component';
import {AccountRoutes} from './account.routing';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AccountRoutes),
        FormsModule
    ],
    declarations: [AccountComponent]
})

export class AccountModule {}
