import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Trip } from '../../models/trip';

@Component({
  selector: 'rider-detail',
  templateUrl: './rider-detail.component.html'
})
export class RiderDetailComponent implements OnInit {
  trip: Trip;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.data.subscribe((data: {trip: Trip}) => this.trip = data.trip);
  }
}
