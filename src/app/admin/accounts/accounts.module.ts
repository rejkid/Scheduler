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


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountsRoutingModule,
        ScheduleModule,
        
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