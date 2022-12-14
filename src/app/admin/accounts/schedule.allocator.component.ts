import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { TimeHandler } from 'src/app/_helpers/time.handler';
import { Account, Role } from 'src/app/_models';
import { Schedule } from 'src/app/_models/schedule';
import { SchedulePoolElement } from 'src/app/_models/schedulepoolelement';
import { UserFunction } from 'src/app/_models/userfunction';
import { AccountService, AlertService } from 'src/app/_services';
import { environment } from 'src/environments/environment';

const dateFormat = `${environment.dateFormat}`;
@Component({ 
  templateUrl: './schedule.allocator.component.html',
  styleUrls: ['./schedule.allocator.component.less']
})


export class ScheduleAllocatorComponent implements OnInit {
  form: FormGroup;
  @Output() onScheduledAdded: EventEmitter<any>;
  id: string;

  scheduleIndexer: number = 0;
  schedules: Schedule[] = [];
  userFunctionIndexer: number = 0;
  functions: string[] = [];
  submitted = false;
  accountService: AccountService;
  account: Account;
  isLoaded: boolean = false;
  isAdding: boolean = false;

  userFunctions: UserFunction[] = [];

  isLoggedAsAdmin: boolean = false;

  date: string = new Date().toISOString().slice(0, 16);

  poolElements: SchedulePoolElement[] = [];
  // isAddScheduleMode : boolean = false;

  constructor(accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef) {

    this.accountService = accountService;
    this.onScheduledAdded = new EventEmitter();

    var d = new Date();
    d.setHours(9, 30, 0, 0);
    d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    this.date = d.toISOString().slice(0, 16);

    this.isLoggedAsAdmin = this.accountService.isAdmin();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    // this.isAddScheduleMode = this.isLoggedAsAdmin; // If not admin then we are adding available dates

    // Get the account for this id 
    this.accountService.getById(this.id)
      .pipe(first())
      .subscribe(account => {

        this.accountService.getRoles()
          .pipe(first())
          .subscribe({
            next: (value) => {
              this.functions = value;

              this.form = this.formBuilder.group({
                scheduledDate: ['', Validators.required],
                function: ['', [Validators.required, this.functionValidator]],
              });

              // this.schedules = account.schedules;
              // this.schedules.sort(function (a, b) {

              //   if (a.date > b.date) return 1
              //   if (a.date < b.date) return -1
              //   return 0
              // });
              this.assignAndSortSchedules(account);

              this.userFunctions = account.userFunctions.slice();

              this.form.get('scheduledDate').setValue(this.date);
              if (this.userFunctions.length > 0) {
                this.form.get('function').setValue(this.userFunctions[0].userFunction);
              }

              this.account = account;
              this.scheduleIndexer = account.schedules.length > 0 ? parseInt(account.schedules[account.schedules.length - 1].id) : 0;
              this.onScheduledAdded.emit(this.schedules);
              this.userFunctionIndexer = account.userFunctions.length > 0 ? parseInt(account.userFunctions[account.userFunctions.length - 1].id) : 0;

              this.isLoaded = true;
            },
            error: error => {
              this.alertService.error(error);
            }
          });

      });
  }

  functionValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value === '') {
      return { invalidFunction: true };
    }
    return null;
  }

  // onSelectAvailableDate(event: any, element: { value: string | number | Date; }) {
  //   var date = element.value;
  //   for (let index = 0; index < this.poolElements.length; index++) {
  //     //const element = this.poolElements[index];

  //     var poolDate = new Date(this.poolElements[index].date);
  //     var selectedDate = new Date(element.value);
  //     if (poolDate.getTime() == selectedDate.getTime()) {
  //       var func = this.poolElements[index].userFunction;
  //       this.form.get('availableFunction').setValue(this.poolElements[index].userFunction);

  //     }
  //   }
  // }
  
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onAddSchedule() {

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    var schedule = this.createSchedule('scheduledDate', 'function');
    if (schedule == null)
      return; // Already exists

    this.isAdding = true;
    this.accountService.addSchedule(this.account.id, schedule)
      .pipe(first())
      .subscribe({
        next: (account) => {
          console.log(account);
          //this.schedules = account.schedules.slice();
          this.assignAndSortSchedules(account);

        },
        complete: () => {
          this.isAdding = false;
        },
        error: error => {
          this.alertService.error(error);
          this.isAdding = false;
        }
      });
  }

  createSchedule(dateStr: string, functionStr: string): Schedule {
    var formDate = new Date(this.form.controls[dateStr].value);
    var formTime = formDate.getTime();

    var formFunction = this.form.controls[functionStr].value;

    for (let index = 0; index < this.schedules.length; index++) {
      var scheduleDate = new Date(this.schedules[index].date);
      var scheduleTime = scheduleDate.getTime();
      var scheduleFunction = this.schedules[index].userFunction;
      if (scheduleTime == formTime && scheduleFunction == formFunction) {
        this.alertService.warn("The user is already " + scheduleFunction + " for that date/time");
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
  onDeleteSchedule(i: string) { // i is table index
    var found: number = -1;
    var schedule2Delete = null;

    for (let index = 0; index < this.schedules.length; index++) {
      var scheduledIndex = this.schedules[index].id;
      if (scheduledIndex === i) {
        found = index; // array index not a table
        schedule2Delete = this.schedules[index];
        break;
      }
    }

    schedule2Delete.deleting = true;
    this.accountService.deleteSchedule(this.account.id, schedule2Delete)
      .pipe(first())
      .subscribe({
        next: (account) => {
          this.assignAndSortSchedules(account);
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
  getDisplayDate(date: Date) : string {
    return TimeHandler.getDateDisplayStrFromFormat(date);
  }

  get isAdmin() {
    return this.account.role == Role.Admin;
  }
}
