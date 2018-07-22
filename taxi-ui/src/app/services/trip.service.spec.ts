import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { TripService } from './trip.service';

class UserFactory {
  static create(data?: Object): User {
    return User.create(Object.assign({
      id: faker.random.number(),
      username: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      group: 'rider',
      photo: faker.image.imageUrl()
    }, data));
  }
}

class TripFactory {
  static create(data?: Object): Trip {
    return Trip.create(Object.assign({
      id: faker.random.number(),
      nk: faker.random.uuid(),
      created: faker.date.past(),
      updated: faker.date.past(),
      pick_up_address: faker.address.streetAddress(),
      drop_off_address: faker.address.streetAddress(),
      status: 'REQUESTED',
      driver: UserFactory.create({group: 'driver'}),
      rider: UserFactory.create()
    }, data));
  }
}

describe('TripService', () => {
  let tripService: TripService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
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
