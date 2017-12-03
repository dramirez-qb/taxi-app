import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Trip } from '../../models/trip';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { DriverDetailComponent } from './driver-detail.component';

describe('DriverDetailComponent', () => {
  let tripService: TripService;
  let component: DriverDetailComponent;
  let fixture: ComponentFixture<DriverDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ DriverDetailComponent ],
      providers: [ AuthService, TripService ]
    }).compileComponents();
    tripService = TestBed.get(TripService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should allow a user to update a trip\'s status', () => {
    let spy = spyOn(tripService, 'updateTrip').and.stub();
    localStorage.setItem('taxi.user', JSON.stringify({
      id: 1,
      username: 'Driver',
      groups: ['driver'],
      auth_token: ''
    }));
    component.trip = new Trip(1);
    component.updateTripStatus('COMPLETED');
    expect(spy.calls.count()).toBe(1);
  });
});
