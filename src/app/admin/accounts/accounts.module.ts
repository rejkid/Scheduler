import { NgModule } from '@angular/core';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleModule } from 'src/app/schedule/schedule.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { FunctionComponent } from './function.component';
import { ScheduleAllocatorComponent } from './schedule.allocator.component';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
//import { AppModule } from 'src/app/app.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountsRoutingModule,
        ScheduleModule,
        //AppModule
        
        MaterialModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatDatepickerModule,
        
    ],
    declarations: [
        ListComponent,
        AddEditComponent,
        FunctionComponent,
        ScheduleAllocatorComponent
        
    ],
    exports: []
})
export class AccountsModule { }