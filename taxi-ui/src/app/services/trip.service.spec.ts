import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Trip, TripService } from './trip.service';
import { TripFactory } from '../tests/factories';

describe('TripService', () => {
  let tripService: TripService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        TripService
      ]
    });
    tripService = TestBed.get(TripService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should allow a user to get a list of trips', () => {
    const responseData = [TripFactory.create(), TripFactory.create()];
    tripService.getTrips().subscribe(trips => {
      expect(trips).toEqual(responseData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/trip/');
    request.flush(responseData);
  });

  it('should allow a user to create a trip', () => {
    tripService.webSocket = jasmine.createSpyObj('webSocket', ['next']);
    const trip: Trip = TripFactory.create();
    tripService.createTrip(trip);
    expect(tripService.webSocket.next).toHaveBeenCalledWith({
      type: 'create.trip',
      data: trip
    });
  });

  it('should allow a user to get a trip by NK', () => {
    const responseData = TripFactory.create();
    tripService.getTrip('nk').subscribe(trip => {
      expect(trip).toEqual(responseData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/trip/nk/');
    request.flush(responseData);
  });

  it('should allow a user to update a trip', () => {
    tripService.webSocket = jasmine.createSpyObj('webSocket', ['next']);
    const trip: Trip = TripFactory.create({status: 'IN_PROGRESS'});
    tripService.updateTrip(trip);
    expect(tripService.webSocket.next).toHaveBeenCalledWith({
      type: 'update.trip',
      data: trip
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
