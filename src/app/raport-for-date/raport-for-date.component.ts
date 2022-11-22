import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Team, } from '../_models/team';
import { DateFunctionTeams } from '../_models/teams';
import { User } from '../_models/user';
import { AccountService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-raport-test',
  templateUrl: './raport-for-date.component.html',
  styleUrls: ['./raport-for-date.component.less']
})
export class RaportForDateComponent implements OnInit {
  list: Date[] = [];
  
  dateSelected: string;
  isLoaded: boolean = false;

  isUsersLoaded: boolean = false;
  users: User[] = [];
  teams: Team[] = [];

  form = new FormGroup({
    dates: new FormControl('', Validators.required)
  });

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.accountService.getAllDates()
      .pipe(first())
      .subscribe({
        next: (value) => {
          this.form = this.formBuilder.group({
            dates: ['', [Validators.required, this.dateValidator]],
          });

          for (let index = 0; index < value.scheduleDateTimes.length; index++) {
            this.list.push(value.scheduleDateTimes[index].date)
          }
          this.list.sort(function (a, b) {

            if (a > b) return 1
            if (a < b) return -1
            return 0
          });

          this.isLoaded = true;
        },
        error: error => {
          console.log();
        }
      });
  }
  get f() {
    return this.form.controls;
  }

  onSelected(value: string): void {
    this.dateSelected = value;
    if (this.dateSelected == "Choose Date")
      return;

    this.users = [];
    this.accountService.GetTeamsByFunctionForDate(this.dateSelected)
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
  dateValidator(control: FormControl): { [s: string]: boolean } {
    var test = control.value.match(/^\d/);
    if (!test) {
      return { invalidDate: true };
    }
    return null;
  }
}
