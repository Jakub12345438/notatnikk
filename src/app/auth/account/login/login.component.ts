import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from 'src/app/core/service/auth.service';
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loading: boolean = false;
    returnUrl: string = '/';

    loginForm!: FormGroup;
    formSubmitted: boolean = false;
    error: string = '';

    showPassword: boolean = false;

    authConfig: AuthConfig = {
        issuer: 'http://localhost:8080',
        strictDiscoveryDocumentValidation: false,
        clientId: 'oidc-client',
        requestAccessToken: true,
        responseType: 'code',
        tokenEndpoint: 'http://localhost:8080/oauth2/token',
        userinfoEndpoint: 'http://localhost:8080/user-info',
        redirectUri: window.location.origin + '/auth/login',
        useSilentRefresh: true,
        scope: 'profile'
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private fb: FormBuilder,
        private oauthService: OAuthService,
        private http: HttpClient
    ) {
        this.oauthService.setStorage(sessionStorage);
        this.oauthService.configure(this.authConfig);
        this.oauthService.loadDiscoveryDocumentAndLogin();

    }

    ngOnInit(): void {
        this.oauthService.events.subscribe(event=>{
            if(event.type == 'token_received'){
                this.http.get('http://localhost:8080/user/info').subscribe(result=>{
                    if(result){
                        sessionStorage.setItem('currentUser', JSON.stringify(result))
                        this.router.navigate([this.returnUrl]);
                    }
                })
            }
        })
        this.loginForm = this.fb.group({
            email: ['admin'],
            password: ['admin']
        });

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/contacts/list';
    }

    /**
     * convenience getter for easy access to form fields
     */
    get formValues() {
        return this.loginForm.controls;
    }

    /**
     * On submit form
     */
    onSubmit(): void {
        this.formSubmitted = true;
        if (this.loginForm.valid) {
            this.loading = true;
            this.oauthService.initCodeFlow();
        }
    }

}
