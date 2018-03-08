import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Trip } from '../models/trip';
import { User } from '../models/user';

@Injectable()
export class TripService {
  private BASE_URL: string = 'http://localhost:8000/api';
  webSocket: Subject<string>;
  messages: Observable<Object>;
  constructor(
    private http: HttpClient
  ) {
    let user: User = User.getUser();
    this.webSocket = Observable.webSocket(`ws://localhost:8000/${user.group}/`);
    this.messages = this.webSocket.share();
    this.messages.subscribe(message => console.log(message));
  }
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.BASE_URL}/trip/`)
      .map(trips => {
        return trips.map(trip => Trip.create(trip));
      });
  }
  createTrip(trip: Trip): void {
    this.webSocket.next(JSON.stringify(trip));
  }
  getTrip(nk: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.BASE_URL}/trip/${nk}/`)
      .map(trip => Trip.create(trip));
  }
  updateTrip(trip: Trip): void {
    this.webSocket.next(JSON.stringify(trip));
  }
}
