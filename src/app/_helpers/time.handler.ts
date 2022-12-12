import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AccountService } from '../_services';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { AbstractControl } from '@angular/forms';

const dateFormat = `${environment.dateFormat}`;

@Injectable()
export class TimeHandler {
    constructor() { }
    static dateVaidator(AC: AbstractControl) {
        if (AC && AC.value && !moment(AC.value, 'YYYY-MM-DD', true).isValid()) {
            return { 'dateVaidator': true };
        }
        return null;
    }
    // static getLocalIsoString(): string {
    //     var date = moment.calendarFormat();
    //     var zoneOffset = date.getTimezoneOffset();
    //     var localISOTime = new Date(date.getTime() - zoneOffset * 60 * 1000).toISOString(); // Local time in ISO format
    //     return localISOTime.replace("Z", "");
    //     //return moment.defaultFormat;
    // }
    static displayStr2LocalIsoString(formDateStr: string): string {
        var date = moment(formDateStr, dateFormat).toDate();
        var zoneOffset = date.getTimezoneOffset();
        var localISOTime = new Date(date.getTime() - zoneOffset * 60 * 1000).toISOString(); // Local time in ISO format
        return localISOTime.replace("Z", "");
    }
    // static dateStr2LocalIsoDate(formDateStr: string, dateFormat : string): Date {
    //     var date = moment(formDateStr, dateFormat).toDate();
    //     var zoneOffset = date.getTimezoneOffset();
    //     var localISOTime = new Date(date.getTime() - zoneOffset * 60 * 1000).toISOString(); // Local time in ISO format
    //     return new Date(localISOTime);
    // }
    static getDateDisplayStrFromFormat(date: Date): string {
        return moment(date).format(dateFormat);
      }
    
}