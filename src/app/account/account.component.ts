import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {stringDistance} from 'codelyzer/util/utils';


@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})



export class AccountComponent implements OnInit {




    user = <any>{};


    constructor(private auth: AuthService,
                private userService: UserService) {

    }

    ngOnInit() {
        this.getUser();

    }

    getUser() {
        this.userService.getUser(this.auth.currentUser).subscribe(
            data => this.user = data,
            error => console.log(error),
            () => console.log('')
        );
    }

    save(user) {

        this.userService.editUser(user).subscribe(
            res => console.log('success'),
            error => console.log(error)
        );
    }


}
