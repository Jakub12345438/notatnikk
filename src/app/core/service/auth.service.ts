import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {User} from '../models/auth.models';
import {OAuthService} from "angular-oauth2-oidc";


@Injectable({providedIn: 'root'})
export class AuthenticationService {
    user: User | null = null;

    constructor(private http: HttpClient, private oauthService: OAuthService) {
    }

    /**
     * Returns the current user
     */
    public currentUser(): User | null {
        if (!this.user) {
            this.user = JSON.parse(sessionStorage.getItem('currentUser')!);
        }
        return this.user;
    }

    /**
     * Performs the login auth
     * @param email email of user
     * @param password password of user
     */

    login(username: string, password: string): any {




    }

    /**
     * Performs the signup auth
     * @param name name of user
     * @param email email of user
     * @param password password of user
     */
    signup(name: string, email: string, password: string): any {
        return this.http.post<any>(`/api/signup`, {name, email, password})
            .pipe(map(user => user));

    }


    /**
     * Logout the user
     */
    logout(): void {
        // remove user from session storage to log user out,
            sessionStorage.removeItem('currentUser');
            this.user = null;
    }
}

