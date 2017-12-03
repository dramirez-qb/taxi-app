import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthService } from './auth.service';

const BASE_URL: string = 'http://localhost:8000/api';

@Injectable()
export class TripService {
  webSocket: Subject<string>;
  messages: Observable<Object>;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.webSocket = Observable.webSocket(`ws://localhost:8000/${User.getGroup()}/`);
    this.messages = this.webSocket.share();
    this.messages.subscribe(message => {
      console.log('From trip service:', message);
    });
  }

  getTrips(): Observable<Trip[]> {
    let url: string = `${BASE_URL}/trip/`;
    return this.http.get<Trip[]>(url);
  }

  getTrip(nk: string): Observable<Trip> {
    let url: string = `${BASE_URL}/trip/${nk}/`;
    return this.http.get<Trip>(url);
  }

  createTrip(trip: Trip): void {
    this.webSocket.next(JSON.stringify(trip));
  }

  updateTrip(trip: Trip): void {
    this.webSocket.next(JSON.stringify(trip));
  }
}
