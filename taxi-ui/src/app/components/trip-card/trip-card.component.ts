import { Component, Input } from '@angular/core';
import { Trip } from '../../models/trip';

@Component({
  selector: 'trip-card',
  templateUrl: './trip-card.component.html'
})
export class TripCardComponent {
  @Input('title') title: string;
  @Input('trips') trips: Trip[];
  constructor() {}
}
