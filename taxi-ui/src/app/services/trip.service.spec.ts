import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Trip } from '../models/trip';
import { AuthService } from './auth.service';
import { TripService } from './trip.service';

describe('TripService', () => {
  let tripService: TripService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [ AuthService, TripService ]
    });
    tripService = TestBed.get(TripService);
    httpMock = TestBed.get(HttpTestingController);
  });
  it('should allow a user to get a list of trips', () => {
    let responseData = [new Trip(), new Trip()];
    tripService.getTrips().subscribe(trips => {
      expect(trips).toBe(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/trip/');
    request.flush(responseData);
  });
  it('should allow a user to create a trip', () => {
    let trip: Trip = new Trip();
    let webSocketSpy: jasmine.Spy = spyOn(tripService.webSocket, 'next').and.stub();
    tripService.createTrip(trip);
    expect(webSocketSpy).toHaveBeenCalledWith(JSON.stringify(trip));
  });
  it('should allow a user to get a trip by NK', () => {
    let responseData = new Trip(1, 'nk');
    tripService.getTrip('nk').subscribe(trip => {
      expect(trip).toBe(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/trip/nk/');
    request.flush(responseData);
  });
  it('should allow a user to update a trip', () => {
    let trip: Trip = new Trip();
    let webSocketSpy: jasmine.Spy = spyOn(tripService.webSocket, 'next').and.stub();
    tripService.updateTrip(trip);
    expect(webSocketSpy).toHaveBeenCalledWith(JSON.stringify(trip));
  });
  afterEach(() => {
    httpMock.verify();
  });
});
