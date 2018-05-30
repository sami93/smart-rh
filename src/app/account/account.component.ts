import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {stringDistance} from 'codelyzer/util/utils';
import swal from "sweetalert2";


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
        swal({
            title: 'Êtes-vous sûr ?',
            text: 'Voulez-vous modifier tes informations ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(() => {
            this.userService.editUser(user).subscribe(

                res => {   console.log(res); console.log("****");console.log(user);swal({
                    title: 'Succès de Modification' ,
                    text: '',
                    type: 'success',
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false
                });},
                error => this.erreur(error, 'Erreur de Modification du compte')
            );


        }, (dismiss) => {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
                swal({
                    title: 'Annulé',
                    text: '',
                    type: 'error',
                    confirmButtonClass: 'btn btn-info',
                    buttonsStyling: false
                });
            }
        }).catch(swal.noop);


    }
    erreur(err, NameOfError) {
        swal(
            '' + NameOfError,
            '' + JSON.stringify(err),
            'error'
        )
    }

}
