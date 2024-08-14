import {Component, Input, OnInit} from '@angular/core';
import {MemberInfo} from '../../shared/contacts.model';
import {AppUser, AppUserDTO} from "../../../../auth/account/shared/appuser.model";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-profile-userbox',
    templateUrl: './userbox.component.html',
    styleUrls: ['./userbox.component.scss']
})
export class UserboxComponent implements OnInit {

    @Input() member: MemberInfo = {};
    @Input() appUser: AppUserDTO = {};

    currentUserId: string = '';


    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params && params.hasOwnProperty('id')) {
                // this.selectedProject = DUMMY_PROJECTS.filter(x => String(x.id) === params['id'])[0];
                this.currentUserId = params['id'];
                this.http.get<AppUser>('http://localhost:8080/user/' + this.currentUserId).subscribe(response => {
                    this.appUser = response;

                });

            }
        });
    }

    deleteUser() {
        this.http.delete('http://localhost:8080/user/' + this.currentUserId).subscribe(response => {
            this.router.navigate(['/apps/contacts/list'])
        })
    }

}
