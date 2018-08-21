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
    const tripData = [TripFactory.create(), TripFactory.create()];
    tripService.getTrips().subscribe(trips => {
      expect(trips).toEqual(tripData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/trip/');
    request.flush(tripData);
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
    const tripData = TripFactory.create();
    tripService.getTrip(tripData.nk).subscribe(trip => {
      expect(trip).toEqual(tripData);
    });
    const request: TestRequest = httpMock.expectOne(`http://localhost:8000/api/trip/${tripData.nk}/`);
    request.flush(tripData);
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
