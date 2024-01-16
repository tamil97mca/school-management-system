import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { StudentEntryModalComponent } from './components/student-entry-modal/student-entry-modal.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { RoutingService } from './services/routing.service';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
import { CouchdbInterceptor } from './couchdb.interceptor';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentDetailComponent,
    StudentEntryModalComponent,
    StudentListComponent,
    LandingComponent,
    LoginComponent,
    AboutUsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    AngularSlickgridModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token') || '';
        },
        allowedDomains: ['https://couch-express-api.onrender.com'],
        disallowedRoutes: ['https://couch-express-api.onrender.com/login'],
      },
    }),

    MatFormFieldModule,
    MatDialogModule
  ],
  providers: [RoutingService, ApiService, AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CouchdbInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
