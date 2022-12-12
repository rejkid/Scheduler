import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
//import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';;
import { ScheduleComponent } from './schedule/schedule.component'
;
import { RaportForDateComponent } from './raport-for-date/raport-for-date.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FloatingSchedulesComponent } from './floating-schedules/floating-schedules.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';




@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        RouterModule,
        BrowserAnimationsModule,
        
        
        
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        RaportForDateComponent,
        FloatingSchedulesComponent
        
        
        
        
        //ScheduleComponent
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        
        // provider used to create fake backend
        //fakeBackendProvider
        // ng build --configuration production  --aot --base-href="/scheduler/"

        // keytool -delete -alias tomcat -keystore localhost-rsa.jks
        // keytool -list -keystore localhost-rsa.jks
        // keytool -genkeypair -alias tomcat -keyalg RSA -keysize 4096 -validity 720 -keystore localhost-rsa.jks -storepass changeit -keypass changeit -ext SAN=dns:rejkid.hopto.org,ip:49.187.112.232
        // keytool -exportcert -keystore localhost-rsa.jks -alias tomcat -file localhost.crt
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }