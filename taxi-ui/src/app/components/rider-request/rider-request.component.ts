import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../../models/trip';
import { User } from '../../models/user';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'rider-request',
  templateUrl: './rider-request.component.html'
})
export class RiderRequestComponent {
  trip: Trip = new Trip();
  constructor(
    private router: Router,
    private tripService: TripService
  ) {}
  onSubmit(): void {
    this.trip.rider = User.getUser();
    this.tripService.createTrip(this.trip);
    this.router.navigateByUrl('/rider');
  }
}
