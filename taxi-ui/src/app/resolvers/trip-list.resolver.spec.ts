import { Observable, of } from 'rxjs';
import { Trip } from '../services/trip.service';
import { TripListResolver } from './trip-list.resolver';

describe('TripListResolver', () => {
  it('should resolve a list of trips', () => {
    const tripsMock: Trip[] = [new Trip(), new Trip()];
    const tripServiceMock: any = {
      getTrips: (): Observable<Trip[]> => {
        return of(tripsMock);
      }
    };
    const tripListResolver: TripListResolver = new TripListResolver(tripServiceMock);
    tripListResolver.resolve(null, null).subscribe(trips => {
      expect(trips).toBe(tripsMock);
    });
  });
});
