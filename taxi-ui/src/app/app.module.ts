// Angular modules.
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// Resolvers.
import { TripDetailResolver } from './resolvers/trip-detail.resolver';
import { TripListResolver } from './resolvers/trip-list.resolver';

// Services.
import { AuthService } from './services/auth.service';
import { GoogleMapsService } from './services/google-maps.service';
import { IsDriver } from './services/is-driver.service';
import { IsRider } from './services/is-rider.service';
import { TokenInterceptor } from './services/token.interceptor';
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

import { ROUTES } from './app.routes';
import { environment } from '../environments/environment';

import { AgmCoreModule } from '@agm/core';
import { ToastyConfig, ToastyModule, ToastyService } from 'ng2-toasty';

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
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY
    }),
    ToastyModule.forRoot()
  ],
  providers: [
    AuthService,
    GoogleMapsService,
    IsDriver,
    IsRider,
    TripListResolver,
    TripDetailResolver,
    TripService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    ToastyConfig,
    ToastyService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
