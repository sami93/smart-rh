import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { PricingComponent } from './pricing/pricing.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import {LogoutComponent} from './logout/logout.component';

export const PagesRoutes: Routes = [

    {
        path: '',
        children: [ {
            path: 'login',
            component: LoginComponent
        },
            {
                path: 'logout',
                component: LogoutComponent
            },{
            path: 'lock',
            component: LockComponent
        }, {
            path: 'register',
            component: RegisterComponent
        }, {
            path: 'pricing',
            component: PricingComponent
        }]
    }
];
