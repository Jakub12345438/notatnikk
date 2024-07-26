import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../models/auth.models';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    user: User | null = null;

    constructor (private http: HttpClient) {
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

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        return this.http.post<any>(`http://localhost:8080/login`, {username: username, password: password} , {
            headers: {'Content-Type': 'application/json' }
        }).pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user.principal) {
                this.user = user;
                // store user details and jwt in session
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            return user;
        }));
    }

    /**
     * Performs the signup auth
     * @param name name of user
     * @param email email of user
     * @param password password of user
     */
    signup(name: string, email: string, password: string): any {
        return this.http.post<any>(`/api/signup`, { name, email, password })
            .pipe(map(user => user));

    }



    /**
     * Logout the user
     */
    logout(): void {
        // remove user from session storage to log user out
        sessionStorage.removeItem('currentUser');
        this.user = null;
    }
}

