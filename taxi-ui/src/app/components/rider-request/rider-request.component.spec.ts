import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Trip } from '../../models/trip';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { RiderRequestComponent } from './rider-request.component';

xdescribe('RiderRequestComponent', () => {
  let tripService: TripService;
  let router: Router;
  let component: RiderRequestComponent;
  let fixture: ComponentFixture<RiderRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ RiderRequestComponent ],
      providers: [ AuthService, TripService ]
    }).compileComponents();
    tripService = TestBed.get(TripService);
    router = TestBed.get(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should allow a user to create a trip', () => {
    let spy = spyOn(tripService, 'createTrip').and.stub();
    let routerSpy = spyOn(router, 'navigateByUrl').and.stub();
    localStorage.setItem('taxi.user', JSON.stringify({
      id: 1,
      username: 'Rider',
      group: 'rider',
      auth_token: ''
    }));
    component.trip = new Trip(1);
    component.onSubmit();
    expect(spy.calls.count()).toBe(1);
    expect(routerSpy.calls.count()).toBe(1);
  });
});
