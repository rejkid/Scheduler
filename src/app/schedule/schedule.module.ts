import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { RouterModule } from '@angular/router';
import { ScheduleListComponent } from './schedule-list.component';
import { ScheduleFunctionComponent } from './schedule-function.component';
import { ScheduleLayoutComponent } from './schedule-layout.component';
import { NavScheduleComponent } from './nav-schedule.component';

import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatDateAdapter, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentAdapter, NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';




@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleListComponent,
    ScheduleFunctionComponent,
    ScheduleLayoutComponent,
    NavScheduleComponent,
  ],
  imports: [
    CommonModule ,
    RouterModule,
    ReactiveFormsModule,
    ScheduleRoutingModule,
    RouterModule,

    MaterialModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    MatSelectModule,

  ],
  exports: [ScheduleComponent]
})
export class ScheduleModule { }
