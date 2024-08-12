import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChartjsOptions} from 'src/app/pages/charts/chartjs/chartjs.model';
import {BreadcrumbItem} from 'src/app/shared/page-title/page-title.model';
import {DUMMY_PROJECTS} from '../shared/data';
import {Project} from '../shared/projects.model';
import {Note} from "../shared/note.model";
import {HttpClient} from "@angular/common/http";
import {QuillModules} from "ngx-quill";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-project-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  selectedProject!: Project;
  selectedNote!: Note;
  projectChartOptions!: ChartjsOptions;
  contentToEdit: string = "";
  quillConfig: QuillModules = {};
  contentEditDisable: boolean = true;
  closePopUp: boolean = false;

  constructor (private route: ActivatedRoute,
               private http: HttpClient,
               private modalService: NgbModal,
               private router: Router) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'Notatki', path: '/' }, { label: 'Szczegóły', path: '/', active: true }];
    this.contentToEdit = 'some text';
    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        // this.selectedProject = DUMMY_PROJECTS.filter(x => String(x.id) === params['id'])[0];
         this.http.get<Note>('http://localhost:8080/note/'+params['id']).subscribe(result=> this.selectedNote = result);
      } else {
        this.selectedProject = DUMMY_PROJECTS[0];
      }
    });
    this.initializeChartConfig();
  }

  onContentEdit(){
    this.contentEditDisable=false;
  }

  openAlertModal(content: TemplateRef<NgbModal>, variant: string): void {
    this.modalService.open(content, { size: 'sm', modalDialogClass: 'modal-filled bg-' + variant });
  }

  onContentSave(){
    this.contentEditDisable = true;
    this.http.put('http://localhost:8080/note/'+this.selectedNote.id, this.selectedNote).subscribe();
  }

  onContentDelete(modal: any){
    modal.close();
    this.http.delete('http://localhost:8080/note/'+this.selectedNote.id).subscribe();
    this.router.navigate(['/apps/notes/list']);
  }

  fetchData(){

  }

  /**
   * initialize chart configuration
   */
  initializeChartConfig(): void {
    // Chart.defaults.global.defaultFontColor = '#8391a2';
    // Chart.defaults.global.defaultFontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell, "Helvetica Neue",sans-serif';

    this.projectChartOptions = {
      type: 'line',
      chartOptions: {
        maintainAspectRatio: false,

        hover: {
          intersect: true
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            intersect: false
          },
          filler: {
            propagate: false
          }
        },
        scales: {
          xAxes: {
            grid: {
              color: "rgba(0,0,0,0.05)"
            }
          },
          yAxes: {
            ticks: {
              stepSize: 20
            },
            display: true,
            grid: {
              color: "rgba(0,0,0,0)",
            }
          }
        }
      }
    };
  }


}
