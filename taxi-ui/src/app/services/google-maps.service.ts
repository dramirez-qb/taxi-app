import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GoogleMapsService {
  private BASE_URL: string = 'http://maps.googleapis.com/maps/api';
  constructor(private http: HttpClient) {}
  directions(pick_up_address: string, drop_off_address: string): Observable<any> {
    let url: string = `${this.BASE_URL}/directions/json`;
    let params: HttpParams = new HttpParams()
      .set('origin', pick_up_address)
      .set('destination', drop_off_address)
      .set('key', 'AIzaSyC_C5bF7OJBV_aORb0xY5kkJ4HXE6LxFJU');
    return this.http.get(url, {params});
  }
}
