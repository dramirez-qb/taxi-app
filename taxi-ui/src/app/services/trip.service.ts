import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { map, share } from 'rxjs/operators';
import { Trip } from '../models/trip';
import { User } from '../models/user';

@Injectable()
export class TripService {
  private BASE_URL = 'http://localhost:8000/api';
  webSocket: WebSocketSubject<string>;
  messages: Observable<any>;
  constructor(
    private http: HttpClient
  ) {
    this.webSocket = new WebSocketSubject(`ws://localhost:8000/taxi/`);
    this.messages = this.webSocket.pipe(share());
    this.messages.subscribe(message => console.log(message));
  }
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.BASE_URL}/trip/`).pipe(
      map(trips => trips.map(trip => Trip.create(trip)))
    );
  }
  createTrip(trip: Trip): void {
    const message: any = {
      type: 'create.trip',
      data: trip
    };
    this.webSocket.next(JSON.stringify(message));
  }
  getTrip(nk: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.BASE_URL}/trip/${nk}/`).pipe(
      map(trip => Trip.create(trip))
    );
  }
  updateTrip(trip: Trip): void {
    const message: any = {
      type: 'update.trip',
      data: trip
    };
    this.webSocket.next(JSON.stringify(message));
  }
}
