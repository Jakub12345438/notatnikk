import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbItem} from 'src/app/shared/page-title/page-title.model';
import {HttpClient} from "@angular/common/http";
import {Todo} from "../shared/todo.model";
import {Select2Data} from "ng-select2-component";
import {NgbDate, NgbDateParserFormatter, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {AppUser} from "../../../auth/account/shared/appuser.model";

// selected member dropdown
type selectedMember = {
    id: number;
    name: string;
    image: string;
}

interface Alert {
    type: string;
    message?: string;
    icon?: string;
}

@Component({
    selector: 'app-project-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    pageTitle: BreadcrumbItem[] = [];

    todo!: Todo;
    image = 'assets/images/users/user-10.jpg';
    teamMembers: Select2Data = [];
    selectedMembers: selectedMember[] = [];
    toDoStartDate!: NgbDate | null;
    toDoEndDate!: NgbDate | null;

    permission: string = '';
    contentEditDisable = true
    closableAlerts: Alert[] = [];
    currentToDoId: string = '';
    allUsers: AppUser[] = [];

    @ViewChild('newProject', {static: true}) newProject!: NgForm;

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private ngbDateParserFormatter: NgbDateParserFormatter,
                private modalService: NgbModal,
                private router: Router) {
    }

    ngOnInit(): void {
        this.pageTitle = [{label: 'Zadania', path: '/'}, {label: 'Szczegóły zadania', path: '/', active: true}];

        this.route.queryParams.subscribe(params => {
            if (params && params.hasOwnProperty('id')) {
                // this.selectedProject = DUMMY_PROJECTS.filter(x => String(x.id) === params['id'])[0];
                this.currentToDoId = params['id'];
                this.http.get<AppUser[]>('http://localhost:8080/user').subscribe(response => {
                    this.allUsers = response;
                    this.teamMembers = response.map(contributor => ({
                        'value': contributor.firstName + ' ' + contributor.lastName,
                        'label': contributor.firstName + ' ' + contributor.lastName,
                        'data': {
                            id: contributor.id,
                            name: contributor.firstName + ' ' + contributor.lastName,
                            image: 'assets/images/users/user-7.jpg'
                        }
                    }))
                });
                this.http.get<Todo>('http://localhost:8080/todo/' + params['id'])
                    .subscribe(result => {
                        this.todo = result
                        let parsedStartDate = this.ngbDateParserFormatter.parse(this.todo.startDate);
                        this.toDoStartDate = NgbDate.from(parsedStartDate);
                        let parsedEndDate = this.ngbDateParserFormatter.parse(this.todo.endDate);
                        this.toDoEndDate = NgbDate.from(parsedEndDate);

                    });
            }
        });
    }

    /**
     * add new members in selected members
     * @param event member data
     */
    addMember(event: any): void {

        const isAlreadySelected = this.selectedMembers.filter(x => x['name'] === event.options[0].data.name);
        if (isAlreadySelected && isAlreadySelected.length === 0) {
            this.selectedMembers.push(event.options[0].data);
        }
    }

    /**
     * returns member id
     */
    trackByItemID(index: number, member: selectedMember): number {
        return member.id;
    }


    closeAlert(contributor: any): void {
        let index = this.todo.contributors.indexOf(contributor);
        if (index > -1) {
            this.todo.contributors.splice(index, 1);
        }
    }

    onContentEdit() {
        this.contentEditDisable = false;
    }

    onContentSave() {
        this.contentEditDisable = true;
        this.selectedMembers.map(member => ({id: member.id})).forEach(id => {
            let contributor = this.allUsers.find(element => element.id === id.id);
            if (contributor && this.todo.contributors.indexOf(contributor) === -1) {
                this.todo.contributors.push(contributor);
            }
        })
        this.http.put('http://localhost:8080/todo/' + this.currentToDoId, this.todo).subscribe();
    }

    openAlertModal(content: TemplateRef<NgbModal>, variant: string): void {
        this.modalService.open(content, {size: 'sm', modalDialogClass: 'modal-filled bg-' + variant});
    }

    onContentDelete(modal: any) {
        modal.close();
        this.http.delete('http://localhost:8080/todo/' + this.currentToDoId).subscribe();
        this.router.navigate(['/apps/todo/list']);
    }
}
