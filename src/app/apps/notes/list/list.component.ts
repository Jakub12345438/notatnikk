import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DUMMY_PROJECTS } from '../shared/data';
import { Project } from '../shared/projects.model';
import {HttpClient} from "@angular/common/http";
import {Note} from "../shared/note.model";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  projectList: Project[] = [];
  noteList: Note[] = [];

  constructor (private http: HttpClient) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Projects', path: '/' }, { label: 'Projects List', path: '/', active: true }];
    // get project list
    this._fetchData();

  }

  /**
   * fetches project list
   */
  _fetchData(): void {
    // this.projectList = DUMMY_PROJECTS;
    this.http.get<Note[]>('http://localhost:8080/note')
        .subscribe(result =>this.noteList = result);
  }


}
