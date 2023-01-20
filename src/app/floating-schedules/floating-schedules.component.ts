import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { TimeHandler } from '../_helpers/time.handler';
import { SchedulePoolElement } from '../_models/schedulepoolelement';
import { UserFunction } from '../_models/userfunction';
import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-floating-schedules',
  templateUrl: './floating-schedules.component.html',
  styleUrls: ['./floating-schedules.component.less']
})
export class FloatingSchedulesComponent implements OnInit {
  isLoaded: boolean = false;
  poolElements: SchedulePoolElement[] = [];
  isLoggedAsAdmin: boolean = false;

  constructor(private accountService: AccountService,
    private alertService: AlertService) {
    this.isLoggedAsAdmin = this.accountService.isAdmin();
  }

  ngOnInit(): void {
    this.accountService.getAllAvailableSchedules()
      .pipe(first())
      .subscribe({
        next: (pollElements) => {
          this.poolElements = pollElements.schedulePoolElements;

          this.isLoaded = true;
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }
  onDeletePoolElement(event: any, scheduleId: string, email: string, userFunction: string) { // i is schedule index
    let poolElement : SchedulePoolElement = this.getPoolElementById(scheduleId);
    if(poolElement == null)
      return; // Nothing to delete, should never happen
    poolElement.deleting = true;
    this.accountService.deletePoolElement(scheduleId, email, userFunction)
      .pipe(first())
      .subscribe({
        next: (schedulePoolElement) => {
          console.log(schedulePoolElement.email);
          this.accountService.getAllAvailableSchedules()
            .pipe(first())
            .subscribe({
              next: (pollElements) => {
                this.poolElements = pollElements.schedulePoolElements;

                this.isLoaded = true;
                poolElement.deleting = false;
              },
              error: error => {
                this.alertService.error(error);
                poolElement.deleting = false;
              }
            });

        },
        error: error => {
          this.alertService.error(error);
        }
      });

  }
  getPoolElementById(poolId: string) : SchedulePoolElement {
    for (let index = 0; index < this.poolElements.length; index++) {
      const element = this.poolElements[index];
      if(element.id === poolId) {
        return element;
      }
    }
    return null;
  }
  getDisplayDate(date: Date): string {
    var str = TimeHandler.getDateDisplayStrFromFormat(date);
    return TimeHandler.getDateDisplayStrFromFormat(date);
  }
}
