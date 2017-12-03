import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from "@angular/platform-browser";
import { DebugElement } from '@angular/core';

import { AppComponent } from '../../app.component';
import { RiderDashboardComponent } from './rider-dashboard.component';
import { IsRider } from '../../services/is-rider.service';
import { Trip } from '../../models/trip';
import { TripListResolver } from '../../services/trip-list.resolver';
import { TripService } from '../../services/trip.service';

xdescribe('RiderDashboardComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let backend: MockBackend;
  let riderFixture: ComponentFixture<RiderDashboardComponent>;
  let riderComponent: RiderDashboardComponent;

  function setUpBackend(responseData: any, status: number = 200) {
    backend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        status: status,
        body: JSON.stringify(responseData)
      })))
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([
          {
            path: 'rider',
            component: RiderDashboardComponent,
            canActivate: [ IsRider ],
            //resolve: [ TripListResolve ]
          }
        ])
      ],
      declarations: [
        AppComponent,
        RiderDashboardComponent
      ],
      providers: [
        IsRider,
        TripListResolver,
        TripService,
        MockBackend,
        BaseRequestOptions,
        // {
        //   provide: Http,
        //   useFactory: (backend, options) => new Http(backend, options),
        //   deps: [ MockBackend, BaseRequestOptions ]
        // }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.get(Router);
    backend = TestBed.get(MockBackend);
    riderFixture = TestBed.createComponent(RiderDashboardComponent);
    riderComponent = riderFixture.componentInstance;
  });

  it('should load the rider dashboard for a rider', fakeAsync(() => {
    let responseData = [{
      id: 1,
      status: 'REQUESTED'
    }];
    setUpBackend(responseData);
    localStorage.setItem('taxi.group', 'rider');
    router.navigate(['rider']);
    tick();
    expect(router.url).toBe('/rider');
  }));

  it('should not load the rider dashboard for a non-rider', fakeAsync(() => {
    let responseData = [{
      id: 1,
      status: 'REQUESTED'
    }];
    setUpBackend(responseData);
    localStorage.clear();
    router.navigate(['rider']);
    tick();
    expect(router.url).toBe('/');
  }));

  it('should filter trips by status', fakeAsync(() => {
    let responseData = [{
      id: 1,
      status: 'REQUESTED'
    }, {
      id: 2,
      status: 'COMPLETED'
    }];
    setUpBackend(responseData);
    tick();
    riderComponent.trips = responseData as Trip[];
    riderFixture.detectChanges();
    let listGroupItems = riderFixture.debugElement.queryAll(By.css('.list-group-item'));
    expect(listGroupItems.length).toBe(1);
  }));

  it('should display current trips', () => {});

  it('should display requested trips', () => {});

  it('should display completed trips', () => {});
});
