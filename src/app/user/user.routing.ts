import { Routes } from '@angular/router';


import {UserListComponent} from './user.component';

export const UserListRoutes: Routes = [
    {

        path: '',
        children: [ {
            path: 'user',
            component: UserListComponent
        }]
    }
];
