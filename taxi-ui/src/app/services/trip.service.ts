import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Trip } from '../models/trip';
import { User } from '../models/user';

const BASE_URL: string = 'http://localhost:8000/api';

@Injectable()
export class TripService {
  webSocket: Subject<string>;
  messages: Observable<any>;
  constructor(
    private http: HttpClient
  ) {
    let user: User = User.getUser();
    this.webSocket = Observable.webSocket(`ws://localhost:8000/taxi/`);
    this.messages = this.webSocket.share();
    this.messages.subscribe(message => console.log(message));
  }
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${BASE_URL}/trip/`)
      .map(trips => {
        return trips.map(trip => Trip.create(trip));
      });
  }
  createTrip(trip: Trip): void {
    let message: any = {
      type: 'create.trip',
      data: trip
    };
    this.webSocket.next(JSON.stringify(message));
  }
  getTrip(nk: string): Observable<Trip> {
    return this.http.get<Trip>(`${BASE_URL}/trip/${nk}/`)
      .map(trip => Trip.create(trip));
  }
  updateTrip(trip: Trip): void {
    let message: any = {
      type: 'update.trip',
      data: trip
    };
    this.webSocket.next(JSON.stringify(message));
  }
}
