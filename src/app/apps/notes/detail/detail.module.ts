import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import {QuillModule} from "ngx-quill";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    DetailComponent
  ],
    imports: [
        CommonModule,
        NgbTooltipModule,
        NgbDropdownModule,
        NgChartsModule,
        WidgetModule,
        PageTitleModule,
        DetailRoutingModule,
        QuillModule,
        FormsModule
    ]
})
export class DetailModule { }
