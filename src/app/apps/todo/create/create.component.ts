import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2Data, Select2Value } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import {HttpClient} from "@angular/common/http";
import {AppUser} from "../../../auth/account/shared/appuser.model";
import {map} from "rxjs/operators";

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
  projectStartDate: string = '';
  projectEndDate: string = '';
  todoPrivacy: string = 'Team';
  files: File[] = [];
  submitted: boolean = false;

  teamMembers: Select2Data = [];
  priority: Select2Data = [];
  selectedMembers: selectedMember[] = [];

  users: AppUser[] = [];

  @ViewChild('newTodo', { static: true }) newProject!: NgForm;
  constructor (private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Zadania', path: '/' }, { label: 'Utwórz zadanie', path: '/', active: true }];

    this.fetchAllUsers();

    this.priority = [
      {
        value: 'LW',
        label: 'Low'
      },
      {
        value: 'MD',
        label: 'Medium'
      },
      {
        value: 'HI',
        label: 'High'
      }
    ];

    // this.teamMembers = [
    //   {
    //     value: 'Shreyu',
    //     label: 'Shreyu N',
    //     data: { id: 1, name: 'Shreyu N', image: 'assets/images/users/user-7.jpg' }
    //   },
    //   {
    //     value: 'Greeva',
    //     label: 'Greeva N',
    //     data: { id: 2, name: 'Greeva N', image: 'assets/images/users/user-10.jpg' }
    //   },
    //   {
    //     value: 'Dhyanu',
    //     label: 'Dhyanu B',
    //     data: { id: 3, name: 'Dhyanu B', image: 'assets/images/users/user-9.jpg' }
    //   },
    //   {
    //     value: 'Mannat',
    //     label: 'Mannat B',
    //     data: { id: 4, name: 'Mannat B', image: 'assets/images/users/user-4.jpg' }
    //   },
    //   {
    //     value: 'Katu',
    //     label: 'Katu s',
    //     data: { id: 5, name: 'Katu S', image: 'assets/images/users/user-5.jpg' }
    //   },
    //   {
    //     value: 'Nik',
    //     label: 'Nik N',
    //     data: { id: 6, name: 'Nik N', image: 'assets/images/users/user-6.jpg' }
    //   },
    //   {
    //     value: 'Rik',
    //     label: 'Rik N',
    //     data: { id: 7, name: 'Rik N', image: 'assets/images/users/user-1.jpg' }
    //   }
    // ]

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
                image: 'assets/images/users/user-10.png'
              }
            }
          })
        });
  }
  /**
   *  on project form submit
   */
  onSubmit(): void {
    if (this.newProject.form.valid) {
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

  /**
   *  adds new file in uploaded files
   */
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  /**
   *   removes file from uploaded files
   */
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  /**
  * Formats the size
  */
  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  /**
   * Returns the preview url
   */
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

}
