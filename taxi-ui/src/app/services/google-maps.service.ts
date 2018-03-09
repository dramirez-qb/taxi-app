import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var google: any;

@Injectable()
export class GoogleMapsService {
  constructor() {}
  directions(
    pick_up_address: string,
    drop_off_address: string
  ): Observable<any> {
    let request: any = {
      origin: pick_up_address,
      destination: drop_off_address,
      travelMode: 'DRIVING'
    };
    let directionsService = new google.maps.DirectionsService();
    return Observable.create(observer => {
      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          observer.next(result);
        }
        else {
          observer.error('Enter two valid addresses.');
        }
        observer.complete();
      });
    });
  }
}
