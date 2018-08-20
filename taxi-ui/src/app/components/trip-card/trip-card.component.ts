import { Component, Input } from '@angular/core';
import { Trip } from '../../services/trip.service';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html'
})
export class TripCardComponent {
  @Input('title') title: string;
  @Input('trips') trips: Trip[];
  constructor() {}
}
