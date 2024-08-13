import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import {NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import {Select2Module} from "ng-select2-component";



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
        Select2Module,
        NgbDatepickerModule,
        NgbAlertModule
    ]
})
export class DetailModule { }
