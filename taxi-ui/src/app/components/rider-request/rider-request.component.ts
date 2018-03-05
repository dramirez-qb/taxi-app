import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../../models/trip';
import { User } from '../../models/user';
import { GoogleMapsService } from '../../services/google-maps.service';
import { TripService } from '../../services/trip.service';

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'rider-request',
  templateUrl: './rider-request.component.html',
  styleUrls: ['./rider-request.component.css']
})
export class RiderRequestComponent implements OnInit {
  lat: number = 0;
  lng: number = 0;
  markers: Marker[];
  trip: Trip = new Trip();
  constructor(
    private googleMapsService: GoogleMapsService,
    private router: Router,
    private tripService: TripService
  ) {}
  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.markers = [
          {
            lat: this.lat,
            lng: this.lng,
            draggable: false
          }
        ];
      });
    }
  }
  onSubmit(): void {
    this.trip.rider = User.getUser();
    this.tripService.createTrip(this.trip);
    this.router.navigateByUrl('/rider');
  }
  onUpdate(): void {

  }
}
