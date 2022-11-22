import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, Role } from '../_models';
import { Schedule } from '../_models/schedule';
import { SchedulePoolElement } from '../_models/schedulepoolelement';
import { UserFunction } from '../_models/userfunction';
import { AccountService, AlertService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements OnInit {
  form: FormGroup;
  id: string;

  schedules: Schedule[] = [];
  scheduleIndexer: number = 0;
  userFunctionIndexer: number = 0;
  functions: string[] = [];
  submitted = false;
  accountService: AccountService;
  account: Account;
  isLoaded: boolean = false;
  addingSchedule: boolean = false;
  userFunctions: UserFunction[] = [];
  isAdding: boolean = false;

  isLoggedAsAdmin: boolean = false;

  date: string = new Date().toISOString().slice(0, 16);

  poolElements: SchedulePoolElement[] = [];
  isAddScheduleMode: boolean = false;

  constructor(accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef) {

    this.accountService = accountService;

    var d = new Date();
    d.setHours(9, 30, 0, 0);
    d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    this.date = d.toISOString().slice(0, 16);

    this.isLoggedAsAdmin = this.accountService.isAdmin();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddScheduleMode = this.isLoggedAsAdmin; // If not admin then we are adding available dates

    // Get the account for this id 
    this.accountService.getById(this.id)
      .pipe(first())
      .subscribe({
        next: (account) => {
          this.accountService.getRoles()
            .pipe(first())
            .subscribe({
              next: (value) => {
                this.functions = value;

                this.form = this.formBuilder.group({
                  availableScheduledDate: ['',],
                  availableFunction: ['',],
                });

                this.assignAndSortSchedules(account);

                this.userFunctions = account.userFunctions.slice();

                this.form.get('availableFunction').disable();

                this.account = account;
                this.scheduleIndexer = account.schedules.length > 0 ? parseInt(account.schedules[account.schedules.length - 1].id) : 0;

                this.userFunctionIndexer = account.userFunctions.length > 0 ? parseInt(account.userFunctions[account.userFunctions.length - 1].id) : 0;


                this.accountService.getAvailableSchedules(account.id)
                  .pipe(first())
                  .subscribe({
                    next: (pollElements) => {
                      this.poolElements = pollElements.schedulePoolElements;

                      if (this.poolElements.length != 0) {
                        this.form.get('availableScheduledDate').setValue(this.poolElements[0].date);
                        this.form.get('availableFunction').setValue(this.poolElements[0].userFunction);
                      }

                      this.isLoaded = true;
                    },
                    error: error => {
                      this.alertService.error(error);
                    }
                  });
              },
              error: (error: any) => {
                this.alertService.error(error);
              }
            });

        },
        error: (error: any) => {
          this.alertService.error(error);
        }
      })
  }

  functionValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value === '') {
      return { invalidFunction: true };
    }
    return null;
  }

  onSelectAvailableDate(event: any, element: { value: string | number | Date; }) {
    var date = element.value;
    for (let index = 0; index < this.poolElements.length; index++) {

      var poolDate = new Date(this.poolElements[index].date);
      var selectedDate = new Date(element.value);
      if (poolDate.getTime() == selectedDate.getTime()) {
        var func = this.poolElements[index].userFunction;
        this.form.get('availableFunction').setValue(this.poolElements[index].userFunction);

      }
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onAddAvailableSchedule() {

    this.submitted = true;
    this.addingSchedule = true;

    // reset alerts on submit
    this.alertService.clear();

    // JD
    // var sD = this.form.controls['scheduledDate'].valid;
    // var func = this.form.controls['function'].valid;

    var aDateValid = this.form.controls['availableScheduledDate'].valid;
    var aF = this.form.controls['availableFunction'].valid;
    // JD

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    var schedule = this.createSchedule4DateAndFunction('availableScheduledDate', 'availableFunction');
    if (schedule == null) {
      this.alertService.warn("Function for the Date already exists");
      return; // Function for the date already exists
    }

    this.isAdding = true;
    this.accountService.GetScheduleFromPool(this.account.id, schedule)
      .pipe(first())
      .subscribe({
        next: (account) => {
          this.addingSchedule = false;

          console.log(account);
          this.assignAndSortSchedules(account);


          if (this.poolElements.length != 0) {
            this.form.get('availableScheduledDate').setValue(this.poolElements[0].date);
            this.form.get('availableFunction').setValue(this.poolElements[0].userFunction);
          }
          this.updateSchedulesAndPoolFromServer();
        },
        complete: () => {
          this.isAdding = false;
        },
        error: error => {
          this.addingSchedule = false;
          this.alertService.error(error);
          this.isAdding = false;
          this.updateSchedulesAndPoolFromServer();
        }
      });
  }

  updateSchedulesAndPoolFromServer() {
    this.accountService.getById(this.id)
      .pipe(first())
      .subscribe({
        next: (account) => {
          this.assignAndSortSchedules(account);

          this.accountService.getAvailableSchedules(account.id)
            .pipe(first())
            .subscribe({
              next: (pollElements) => {
                console.log(pollElements);
                this.poolElements = pollElements.schedulePoolElements;

                if (this.poolElements.length != 0) {
                  this.form.get('availableScheduledDate').setValue(this.poolElements[0].date);
                  this.form.get('availableFunction').setValue(this.poolElements[0].userFunction);
                }
              },
              error: error => {
                this.alertService.error(error);
              }
            });
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }
  createSchedule4DateAndFunction(dateStr: string, functionStr: string): Schedule {
    var formDate = new Date(this.form.controls[dateStr].value);
    var formTime = formDate.getTime();
    var formFunction = this.form.controls[functionStr].value;

    for (let index = 0; index < this.schedules.length; index++) {
      var scheduleDate = new Date(this.schedules[index].date);
      var scheduleTime = scheduleDate.getTime();
      var scheduleFunction = this.schedules[index].userFunction;
      if (scheduleTime == formTime && scheduleFunction == formFunction && this.schedules[index].userAvailability) {

        return null;
      }
    }

    var schedule: Schedule = {
      id: (++this.scheduleIndexer).toString(),
      date: this.form.controls[dateStr].value,
      required: true,
      deleting: false,
      userAvailability: true,
      userFunction: this.form.controls[functionStr].value
    }
    return schedule;
  }

  onDeleteSchedule(event: any, scheduleId: string) { // i is schedule index

    var found: number = -1;
    var schedule2Delete = null;

    for (let index = 0; index < this.schedules.length; index++) {
      var scheduledIndex = this.schedules[index].id;
      if (scheduledIndex === scheduleId) {
        found = index; // array index not a schedule
        schedule2Delete = this.schedules[index];
        break;
      }
    }
    const index = this.findScheduleIndexByScheduleId(scheduleId);
    var schedule = null;

    if (index == -1) {
      return;
    }

    schedule = this.schedules[index];
    schedule.deleting = true;

    this.accountService.MoveSchedule2Pool(this.account.id, schedule2Delete)
      .pipe(first())
      .subscribe({
        next: (account) => {
          this.assignAndSortSchedules(account);

          this.schedules = account.schedules;
          this.updateSchedulesAndPoolFromServer();
        },
        error: error => {
          this.alertService.error(error);
        }
      });

  }

  assignAndSortSchedules(account: Account) {
    this.schedules = account.schedules.slice();
    this.schedules.sort(function (a, b) {

      if (a.date > b.date) return 1
      if (a.date < b.date) return -1
      return 0
    });
  }

  private findScheduleIndexByScheduleId(scheduleId: string) {
    var found: number = -1;
    for (let index = 0; index < this.schedules.length; index++) {
      var scheduledIndex = this.schedules[index].id;
      if (scheduledIndex === scheduleId) {
        found = index; // array index not a table
        break;
      }
    }
    return found;
  }

  get isAdmin() {
    return this.account.role == Role.Admin;
  }
}
