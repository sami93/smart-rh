import { Component, OnInit, ElementRef } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    loginForm: FormGroup;
    email = new FormControl('', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]);
    password = new FormControl('', [Validators.required,
        Validators.minLength(6)]);
    constructor(private element: ElementRef,
                private auth: AuthService,
                private formBuilder: FormBuilder,
                private router: Router,
                ) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        if (this.auth.loggedIn) {
            this.router.navigate(['/dashboard']);
        }
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.loginForm = this.formBuilder.group({
            email: this.email,
            password: this.password
        });

        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }
    setClassEmail() {
        return { 'has-danger': !this.email.pristine && !this.email.valid };
    }
    setClassPassword() {
        return { 'has-danger': !this.password.pristine && !this.password.valid };
    }

    login() {
        this.auth.login(this.loginForm.value).subscribe(
            res => {
                this.router.navigate(['/dashboard']) ;
            console.log('samiiiiii');
            },
            error => console.log('erreur')
        );
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
}
