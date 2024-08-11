import {Injectable, Optional} from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

import { AuthenticationService } from '../service/auth.service';
import {OAuthModuleConfig, OAuthStorage} from "angular-oauth2-oidc";
import {Router} from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private oauthStorage: OAuthStorage,
                @Optional() private moduleConfig: OAuthModuleConfig,
                private authenticationService: AuthenticationService,
                private router: Router) {
    }

    private checkUrl(url: string): boolean {
        let found =  url.startsWith('http://localhost:8080');
        return !!found;
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let url = req.url.toLowerCase();

        if (!this.moduleConfig) return next.handle(req);
        if (!this.moduleConfig.resourceServer) return next.handle(req);
        if (!this.moduleConfig.resourceServer.allowedUrls) return next.handle(req);
        if (!this.checkUrl(url)) return next.handle(req);
        let sendAccessToken = this.moduleConfig.resourceServer.sendAccessToken;
        if (this.oauthStorage.getItem('access_token')) {
            let token = this.oauthStorage.getItem('access_token');
            let header = 'Bearer ' + token;

            let headers = req.headers
                .set('Authorization', header);

            let currentUrl = req.urlWithParams;
            req = req.clone({headers});
        }
        return next.handle(req).pipe(catchError(err => {
            if(err.status === 401){
                sessionStorage.clear();
                this.authenticationService.logout();
                this.router.navigate(['/']);
            }
            const error = err.error.message || err.statusText;
            return throwError(()=>error);
        }));
    }
}
