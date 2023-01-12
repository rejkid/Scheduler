import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { first, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TimeHandler } from '../_helpers/time.handler';

import { AccountService, AlertService } from '../_services';

@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            dob: ['', [Validators.required, TimeHandler.dateValidator]],
        });
        this.form.get('dob').setValue(moment(new Date()).format( `${environment.dateFormat}`));
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
        this.alertService.clear();
        this.accountService.forgotPassword(this.f['email'].value, moment(this.f['dob'].value).format( `${environment.dateFormat}`))
            .pipe(first())
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => this.alertService.success('Please check your email for password reset instructions'),
                error: error => this.alertService.error(error)
            });
    }
    getDisplayDate(date: Date): string {
        var str = TimeHandler.getDateDisplayStrFromFormat(date);
        return TimeHandler.getDateDisplayStrFromFormat(date);
    }
}