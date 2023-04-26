﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from 'src/app/_helpers';
import { TimeHandler } from 'src/app/_helpers/time.handler';
import * as moment from 'moment';

import { AccountService, AlertService } from 'src/app/_services';
import { UserFunction } from 'src/app/_models/userfunction';
import { Account, Role } from 'src/app/_models';
import { environment } from 'src/environments/environment';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    DATE_FORMAT = `${environment.dateFormat}`;

    form: FormGroup;
    id: string;// =  this.route.snapshot.params['id'];;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    roles: string[] = [];
    account: Account;
    userFunctions: UserFunction[] = [];
    isLoaded: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        this.roles = Object.values(Role).filter(value => typeof value === 'string') as string[]

    }

    userFunctionAdded(functions: UserFunction[]) {
        this.userFunctions = functions;
    }

    getDateDisplayStr(date: Date): string {
        return TimeHandler.getDateDisplayStrFromFormat(date)
    }
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            dob: ['', [Validators.required, TimeHandler.dateValidator]],
            password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe({
                    next: (x) => {
                        // Edit mode
                        this.account = x; // initial account
                        this.form.patchValue(x);
                        this.form.get('dob').setValue(TimeHandler.convertServerDate2Local(this.account.dob)); // Overwrite patch for DOB
                    },
                    error: error => {
                        console.error(error);
                    }
                });
        } else {
            // Add mode
            this.form.get('role').setValue(this.roles[0]);
            this.form.get('dob').setValue(new Date());
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        if (this.isAddMode) {
            this.createAccount();
        } else {
            this.updateAccount();
        }
    }

    private createAccount() {
        // var formDateStr = this.getDateDisplayStr(this.f['dob'].value);
        // formDateStr = TimeHandler.getDatetimeLocaleFromDisplayDate(this.f['dob'].value);
        // var localISOTime = TimeHandler.displayStr2LocalIsoString(formDateStr);

        //this.f['dob'].setValue(/* this.f['dob'].value *//* moment(this.f['dob'].value).format(`${environment.dateFormat}`) */);
        this.accountService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Account created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateAccount() {
        //this.f['dob'].setValue(moment(this.f['dob'].value).format(`${environment.dateFormat}`));
        this.accountService.update(this.id, this.form.value/* this.account */)
            .pipe(first())
            .subscribe({
                next: (value) => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}