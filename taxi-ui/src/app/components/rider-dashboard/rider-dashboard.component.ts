import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Trip } from '../../models/trip';
import { User } from '../../models/user';
import { TripService } from '../../services/trip.service';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'rider-dashboard',
  templateUrl: './rider-dashboard.component.html'
})
export class RiderDashboardComponent implements OnDestroy, OnInit {
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
    if (trip.status === 'STARTED') {
      this.toastyService.info(`Driver ${trip.driver.username} is coming to pick you up.`);
    }
    else if (trip.status === 'IN_PROGRESS') {
      this.toastyService.info(`Driver ${trip.driver.username} is headed to your destination.`);
    }
    else if (trip.status === 'COMPLETED') {
      this.toastyService.info(`Driver ${trip.driver.username} has dropped you off.`);
    }
  }
  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }
}
