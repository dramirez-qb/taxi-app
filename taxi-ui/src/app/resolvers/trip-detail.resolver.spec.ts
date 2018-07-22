import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { TripDetailResolver } from './trip-detail.resolver';

describe('TripDetailResolver', () => {
  it('should resolve a trip', () => {
    const tripMock: Trip = new Trip(1, 'nk');
    const tripServiceMock: any = {
      getTrip: (nk: string): Observable<Trip> => {
        return new Observable<Trip>(observer => {
          observer.next(tripMock);
          observer.complete();
        });
      }
    };
    const tripDetailResolver: TripDetailResolver = new TripDetailResolver(tripServiceMock);
    const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    route.params = {nk: 'nk'};
    tripDetailResolver.resolve(route, null).subscribe(trip => {
      expect(trip).toBe(tripMock);
    });
  });
});
