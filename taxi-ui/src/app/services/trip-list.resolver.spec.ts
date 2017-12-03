import { Observable } from 'rxjs/Rx';
import { Trip } from '../models/trip';
import { TripListResolver } from './trip-list.resolver';

describe('TripListResolver', () => {
  it('should resolve a list of trips', () => {
    let tripsMock: Trip[] = [new Trip(), new Trip()];
    let tripServiceMock: any = {
      getTrips: (): Observable<Trip[]> => {
        return Observable.of(tripsMock);
      }
    }
    let tripListResolver: TripListResolver = new TripListResolver(tripServiceMock);
    tripListResolver.resolve(null, null).subscribe(trips => {
      expect(trips).toBe(tripsMock);
    });
  });
});
