import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Trip } from '../../models/trip';
import { User } from '../../models/user';
import { TripService } from '../../services/trip.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'driver-dashboard',
  templateUrl: './driver-dashboard.component.html'
})
export class DriverDashboardComponent implements OnDestroy, OnInit {
  messages: Subscription;
  trips: Trip[];
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private toastyService: ToastyService
  ) {}
  get currentTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.driver !== null && trip.status !== 'COMPLETED';
    });
  }
  get requestedTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.status === 'REQUESTED';
    });
  }
  get completedTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.status === 'COMPLETED';
    });
  }
  ngOnInit(): void {
    this.route.data.subscribe((data: {trips: Trip[]}) => this.trips = data.trips);
    this.messages = this.tripService.messages.subscribe(message => {
      let trip: Trip = <Trip> message;
      this.updateTrips(trip);
      this.updateToast(trip);
    });
  }
  updateTrips(trip: Trip): void {
    this.trips = this.trips.filter(thisTrip => thisTrip.id !== trip.id);
    this.trips.push(trip);
  }
  updateToast(trip: Trip): void {
    if (trip.driver === null) {
      this.toastyService.info(`Rider ${trip.rider.username} has requested a trip.`);
    }
  }
  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }
}
