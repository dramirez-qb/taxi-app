import {
  HttpClientTestingModule, HttpTestingController, TestRequest
} from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LandingComponent } from './landing.component';

xdescribe('LandingComponent', () => {
  let logOutButton: DebugElement;
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ LandingComponent ],
      providers: [ AuthService ]
    });
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    localStorage.setItem('taxi.user', JSON.stringify({
      username: 'rider@example.com'
    }));
    fixture.detectChanges();
    logOutButton = fixture.debugElement.query(By.css('button.btn.btn-primary'));
  });

  it('should allow a user to log out of an account', () => {
    logOutButton.triggerEventHandler('click', null);
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_out/');
    request.flush({});
    expect(localStorage.getItem('taxi.user')).toBeNull();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
