import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Select2Data, Select2Value } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import {HttpClient} from "@angular/common/http";

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
  files: File[] = [];
  submitted: boolean = false;

  teamMembers: Select2Data = [];
  priority: Select2Data = [];
  selectedMembers: selectedMember[] = [];

  @ViewChild('newProject', { static: true }) newProject!: NgForm;
  constructor (private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Notatnik', path: '/' }, { label: 'Dodaj notatkę', path: '/', active: true }];

  }

  /**
   *  on project form submit
   */
  onSubmit(): void {
    if (this.newProject.form.valid) {
      this.http.post(`http://localhost:8080/note`, {title: this.title, content: this.content}, {withCredentials: true}).subscribe();
      this.newProject.form.reset();

    }
  }
}
