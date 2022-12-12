import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Team, } from '../_models/team';
import { DateFunctionTeams } from '../_models/teams';
import { User } from '../_models/user';
import { AccountService } from '../_services';
import { first } from 'rxjs/operators';
import { TimeHandler } from '../_helpers/time.handler';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ScheduleDateTimes } from '../_models/scheduledatetimes';


@Component({
  selector: 'app-raport-test',
  templateUrl: './raport-for-date.component.html',
  styleUrls: ['./raport-for-date.component.less']
})
export class RaportForDateComponent implements OnInit {
  form: FormGroup;
  list: Date[] = [];
  latesetList: string[] = [];

  dateSelected: string;
  isLoaded: boolean = false;

  isUsersLoaded: boolean = false;
  users: User[] = [];
  teams: Team[] = [];

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      dates: ['', [Validators.required, this.dateValidator]],
      allDates: [false, '',]
    });
    this.getAllDates();
  }
  onCheckboxChange(event: any) {
    this.getAllDates();
  }

  get f() {
    return this.form.controls;
  }

  onSelected(value: any): void {
    this.dateSelected = value;
    if (this.latesetList.length <= 0 )
      return;

    this.users = [];
    
    //var locTime = moment(this.dateSelected, dateFormat).toISOString();
    var localISOTime = TimeHandler.displayStr2LocalIsoString(this.dateSelected);
    this.accountService.GetTeamsByFunctionForDate(/*locTime*/localISOTime)
      .pipe(first())
      .subscribe({
        next: (dateFunctionTeams: DateFunctionTeams) => {
          this.teams = dateFunctionTeams.dateFunctionTeams;

          for (let index = 0; index < this.teams.length; index++) {
            var user: User[] = this.teams[index].users
            console.log(this.teams[index]);

            for (let i = 0; i < this.teams[index].users.length; i++) {
              this.users.push(this.teams[index].users[i]);
            }
            console.log(this.users);
          }
        },
        error: error => {
          console.log();
        }
      });

  }

  getAllDates() {
    this.latesetList = [];
    this.list = [];
    this.accountService.getAllDates()
      .pipe(first())
      .subscribe({
        next: (value : ScheduleDateTimes) => {

          for (let index = 0; index < value.scheduleDateTimes.length; index++) {
            this.list.push(value.scheduleDateTimes[index].date)
          }
          this.list.sort(function (a, b) {

            if (a > b) return 1
            if (a < b) return -1
            return 0
          });
          for (let index = 0; index < this.list.length; index++) {
            const element = this.list[index];
            var tnow = Date.now();
            var tElement = Date.parse(element as any);
            if (this.f['allDates'].value || tElement > tnow) {
              this.latesetList.push(this.getDateDisplayStr(element));
            }
          }
          if (this.latesetList.length > 0) {
            this.form.get('dates').setValue(this.latesetList.at(0));
          }

          this.isLoaded = true;
        },
        error: error => {
          console.log();
        }
      });

  }
  getDateDisplayStr(date: Date): string {
    return TimeHandler.getDateDisplayStrFromFormat(date)
  }

  dateValidator(control: FormControl): { [s: string]: boolean } {
    var test = control.value.match(/^\d/);
    if (!test) {
      return { invalidDate: true };
    }
    return null;
  }
}
