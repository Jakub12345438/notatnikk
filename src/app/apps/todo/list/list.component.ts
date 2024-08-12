import {Component, OnInit} from '@angular/core';
import {BreadcrumbItem} from 'src/app/shared/page-title/page-title.model';
import {Todo} from '../shared/todo.model';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  taskList: Todo[] = [];

  constructor (private http: HttpClient) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Zadania', path: '/' }, { label: 'Lista Zadań', path: '/', active: true }];
    // get project list
    this._fetchData();

  }

  /**
   * fetches project list
   */
  _fetchData(): void {
    this.http.get<Todo[]>('http://localhost:8080/todo').subscribe(result =>this.taskList = result);
  }


}
