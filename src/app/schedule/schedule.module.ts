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




@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleListComponent,
    ScheduleFunctionComponent,
    ScheduleLayoutComponent,
    NavScheduleComponent
  ],
  imports: [
    CommonModule ,
    RouterModule,
    ReactiveFormsModule,
    ScheduleRoutingModule,
    RouterModule,
  ],
  exports: [ScheduleComponent]
})
export class ScheduleModule { }
