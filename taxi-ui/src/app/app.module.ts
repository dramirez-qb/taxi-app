// Angular modules.
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Services.
import { AuthService } from './services/auth.service';
import { IsDriver } from './services/is-driver.service';
import { IsRider } from './services/is-rider.service';
import { TripDetailResolver } from './services/trip-detail.resolver';
import { TripListResolver } from './services/trip-list.resolver';
import { TripService } from './services/trip.service';

// Components.
import { AppComponent } from './app.component';
import { DriverComponent } from './components/driver/driver.component';
import { DriverDashboardComponent } from './components/driver-dashboard/driver-dashboard.component';
import { DriverDetailComponent } from './components/driver-detail/driver-detail.component';
import { LandingComponent } from './components/landing/landing.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RiderComponent } from './components/rider/rider.component';
import { RiderDashboardComponent } from './components/rider-dashboard/rider-dashboard.component';
import { RiderDetailComponent } from './components/rider-detail/rider-detail.component';
import { RiderRequestComponent } from './components/rider-request/rider-request.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TripCardComponent } from './components/trip-card/trip-card.component';

import { routes } from './routes';

import { ToastModule } from 'ng2-toastr/ng2-toastr';

@NgModule({
  declarations: [
    AppComponent,
    DriverComponent,
    DriverDashboardComponent,
    DriverDetailComponent,
    LandingComponent,
    LogInComponent,
    RiderComponent,
    RiderDashboardComponent,
    RiderDetailComponent,
    RiderRequestComponent,
    SignUpComponent,
    TripCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    ToastModule.forRoot()
  ],
  providers: [
    AuthService,
    IsDriver,
    IsRider,
    TripListResolver,
    TripDetailResolver,
    TripService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
