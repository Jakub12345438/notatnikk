import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbItem} from 'src/app/shared/page-title/page-title.model';
import {MemberInfo} from '../shared/contacts.model';
import {MEMBERLIST} from '../shared/data';
import {AppUserDTO} from "../../../auth/account/shared/appuser.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

    pageTitle: BreadcrumbItem[] = [];
    memberList: MemberInfo[] = [];
    searchTerm: string = '';
    newCustomer!: FormGroup;
    page = 1;

    users: AppUserDTO[] = [];

    @ViewChild('content', {static: true}) content: any;
    @ViewChild('alertModal', {static: true}) alertModal: any;

    constructor(
        public activeModal: NgbModal,
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.pageTitle = [{label: 'Użytkownicy', path: '/'}, {label: 'Lista użytkowników', path: '/', active: true}];
        this._fetchData();
        this.newCustomer = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.http.get<AppUserDTO[]>('http://localhost:8080/user').subscribe(response => {
            this.users = response
        });
    }

    // convenience getter for easy access to form fields
    get form1() {
        return this.newCustomer.controls;
    }

    /**
     * fetches member list
     */
    _fetchData(): void {
        this.memberList = MEMBERLIST;
    }

    /**
     * opens modal
     * @param title title of modal
     * @param data data to be used in modal
     */
    openModal(): void {
        this.activeModal.open(this.content, {centered: true});
    }

    /**
     * Search Method
     */
    searchData(searchTerm: string): void {
        if (searchTerm === '') {
            this._fetchData();
        } else {
            let updatedData = MEMBERLIST;
            //  filter
            // updatedData = updatedData.filter(member => (member.name?.toLowerCase().includes(searchTerm) || member.position?.toLowerCase().includes(searchTerm)));
            this.memberList = updatedData;
        }

    }

    onSubmitForm(): void {
        const requestBody = {
            firstName: this.form1.firstName.value,
            lastName: this.form1.lastName.value,
            username: this.form1.username.value,
            password: this.form1.password.value
        }
        this.http.get('http://localhost:8080/user?username=' + this.form1.username.value).subscribe({
            next: value => {
                debugger
                this.form1.username.setErrors({'incorrect': true})
                this.openAlertModal(this.alertModal,'danger')
            },
            error: error => {
                if (error.status === 404) {
                    this.http.post('http://localhost:8080/user', requestBody).subscribe(response => {
                    });
                    this.activeModal.dismissAll();
                    this.router.navigate(['/apps/contacts/list']);
                }
            }
        })
    }

    openAlertModal(content: TemplateRef<NgbModal>, variant: string): void {
        this.modalService.open(content, {size: 'sm', modalDialogClass: 'modal-filled bg-' + variant});
    }
}
