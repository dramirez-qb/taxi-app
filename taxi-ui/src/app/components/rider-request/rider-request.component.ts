import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../../models/trip';
import { User } from '../../models/user';
import { GoogleMapsService } from '../../services/google-maps.service';
import { TripService } from '../../services/trip.service';

class Marker {
  constructor(
    public lat: number,
    public lng: number,
    public draggable: boolean,
    public label?: string
  ) {}
}

@Component({
  selector: 'rider-request',
  templateUrl: './rider-request.component.html',
  styleUrls: ['./rider-request.component.css']
})
export class RiderRequestComponent implements OnInit {
  lat: number = 0;
  lng: number = 0;
  zoom: number = 13;
  markers: Marker[];
  trip: Trip = new Trip();
  constructor(
    private googleMapsService: GoogleMapsService,
    private router: Router,
    private tripService: TripService
  ) {}
  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.markers = [
          new Marker(this.lat, this.lng, false)
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
    if (!!this.trip.pick_up_address && !!this.trip.drop_off_address) {
      this.googleMapsService.directions(
        this.trip.pick_up_address,
        this.trip.drop_off_address
      ).subscribe((data: any) => {
        let route: any = data.routes[0];
        let leg: any = route.legs[0];
        this.lat = leg.start_location.lat();
        this.lng = leg.start_location.lng();
        this.markers = [
          {
            lat: leg.start_location.lat(),
            lng: leg.start_location.lng(),
            label: 'A',
            draggable: false
          },
          {
            lat: leg.end_location.lat(),
            lng: leg.end_location.lng(),
            label: 'B',
            draggable: false
          }
        ];
        this.zoom = 13;
      });
    }
  }
}
