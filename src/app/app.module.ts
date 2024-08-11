import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {JoyrideModule} from 'ngx-joyride';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
// import {ErrorInterceptor} from './core/helpers/error.interceptor';
import {FakeBackendProvider} from './core/helpers/fake-backend';
import {JwtInterceptor} from './core/helpers/jwt.interceptor';
import {LayoutModule} from './layout/layout.module';
import {OAuthModule, OAuthModuleConfig, OAuthService, OAuthStorage} from "angular-oauth2-oidc";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        JoyrideModule.forRoot(),
        SweetAlert2Module.forRoot(),
        AppRoutingModule,
        LayoutModule,
        OAuthModule.forRoot()
    ],
    providers: [
        Title,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        // {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        // provider used to create fake backend
        {provide: OAuthStorage, useValue: sessionStorage},
        {provide: OAuthModuleConfig, useFactory: authConfigFactory},
        FakeBackendProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function authConfigFactory(): OAuthModuleConfig {
    return {
        resourceServer: {
            allowedUrls: ['http://localhost:8080'],
            sendAccessToken: true,
        }
    };
}