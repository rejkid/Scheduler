import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AccountService } from '../_services';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';


@Injectable()
export class TimeHandler {
    constructor() { }

    static displayStr2LocalIsoString(formDateStr: string, dateFormat : string): string {
        var date = moment(formDateStr, dateFormat).toDate();
        var zoneOffset = date.getTimezoneOffset();
        var localISOTime = new Date(date.getTime() - zoneOffset * 60 * 1000).toISOString(); // Local time in ISO format
        return localISOTime;
    }
    // static dateStr2LocalIsoDate(formDateStr: string, dateFormat : string): Date {
    //     var date = moment(formDateStr, dateFormat).toDate();
    //     var zoneOffset = date.getTimezoneOffset();
    //     var localISOTime = new Date(date.getTime() - zoneOffset * 60 * 1000).toISOString(); // Local time in ISO format
    //     return new Date(localISOTime);
    // }
    static getDateDisplayStrFromFormat(date: Date, dateFormat : string): string {
        return moment(date).format(dateFormat);
      }
    
}