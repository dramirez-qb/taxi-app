import { Routes } from '@angular/router';

// Resolvers.
import { TripDetailResolver } from './resolvers/trip-detail.resolver';
import { TripListResolver } from './resolvers/trip-list.resolver';

// Services.
import { IsDriver } from './services/is-driver.service';
import { IsRider } from './services/is-rider.service';

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

export const ROUTES: Routes = [
  { path: 'sign-up', component: SignUpComponent },
  { path: 'log-in', component: LogInComponent },
  {
    path: 'rider',
    component: RiderComponent,
    canActivate: [ IsRider ],
    children: [
      { path: 'request', component: RiderRequestComponent },
      { path: ':nk', component: RiderDetailComponent, resolve: { trip: TripDetailResolver } },
      { path: '', component: RiderDashboardComponent, resolve: { trips: TripListResolver } }
    ]
  },
  {
    path: 'driver',
    component: DriverComponent,
    canActivate: [ IsDriver ],
    children: [
      { path: ':nk', component: DriverDetailComponent, resolve: { trip: TripDetailResolver } },
      { path: '', component: DriverDashboardComponent, resolve: { trips: TripListResolver } }
    ]
  },
  { path: '', component: LandingComponent }
];
