import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor (
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUser();
        let expiresAt = sessionStorage.getItem('expires_at');


        if (currentUser && Number(expiresAt)>Date.now()) {
            return true;
        }else{
            this.authenticationService.logout();
            this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        // not logged in so redirect to login page with the return url
    }
}