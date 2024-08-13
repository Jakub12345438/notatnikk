import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {Select2Data} from 'ng-select2-component';
import {BreadcrumbItem} from 'src/app/shared/page-title/page-title.model';
import {HttpClient} from "@angular/common/http";
import {AppUser} from "../../../auth/account/shared/appuser.model";
import {NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

// selected member dropdown
type selectedMember = {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-project-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  title: string = '';
  content: string = '';
  toDoStartDate!: NgbDate;
  toDoEndDate!: NgbDate;
  permission: string = 'Team';
  files: File[] = [];
  submitted: boolean = false;

  teamMembers: Select2Data = [];
  selectedMembers: selectedMember[] = [];

  users: AppUser[] = [];

  @ViewChild('newProject', { static: true }) newProject!: NgForm;
  constructor (private sanitizer: DomSanitizer, private http: HttpClient, private ngbDateParserFormatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Zadania', path: '/' }, { label: 'Utwórz zadanie', path: '/', active: true }];

    this.fetchAllUsers();

    this.selectedMembers = [
    ];
  }

  fetchAllUsers(){
    this.http.get<AppUser[]>('http://localhost:8080/user')
        .subscribe(result=> {
          this.users = result;

          this.teamMembers = this.users.map(user=> {

            return {
              value: user.username,
              label: user.firstName + ' ' + user.lastName,
              enabled: user.enabled,
              data: {
                id: user.id,
                name: user.firstName + ' ' + user.lastName,
                image: 'assets/images/users/user-10.jpg'
              }
            }
          })
        });
  }
  /**
   *  on project form submit
   */
  onSubmit(): void {

    const requestBody = {
      title: this.title,
      content: this.content,
      startDate: this.ngbDateParserFormatter.format(this.toDoStartDate),
      endDate: this.ngbDateParserFormatter.format(this.toDoEndDate),
      contributors: this.selectedMembers.map(member=> ({'id' : member.id}))
    }

    if (this.newProject.form.valid) {
      debugger
      this.http.post('http://localhost:8080/todo', requestBody).subscribe(result=>{});
      this.newProject.form.reset();
    }
  }

  /**
   * returns member id
   */
  trackByItemID(index: number, member: selectedMember): number { return member.id; }


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
}
