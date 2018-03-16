import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Trip } from '../models/trip';
import { TripService } from './trip.service';
import { Observable } from 'rxjs';

@Injectable()
export class TripListResolver implements Resolve<Trip[]> {
  constructor(private tripService: TripService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Trip[]> {
    return this.tripService.getTrips();
  }
}
