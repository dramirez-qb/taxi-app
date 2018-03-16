import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Trip } from '../../models/trip';
import { User } from '../../models/user';
import { TripService } from '../../services/trip.service';

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
    private toastsManager: ToastsManager,
    private viewContainerRef: ViewContainerRef
  ) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }
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
    this.messages = this.tripService.messages.subscribe((message: any) => {
      let trip: Trip = Trip.create(message.data);
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
      this.toastsManager.info(`Rider ${trip.rider.username} has requested a trip.`);
    }
  }
  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }
}
