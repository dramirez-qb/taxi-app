import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from "@angular/platform-browser";
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { User } from '../../models/user';
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

    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;

    localStorage.setItem('taxi.user', JSON.stringify({
      username: 'rider@example.com',
      auth_token: '2df504b532e39a49e05b08b8ba718f7a327b8f76'
    }));
    fixture.detectChanges();

    logOutButton = fixture.debugElement.query(By.css('button.btn.btn-primary'));
  });

  it('should allow a user to log out of an account', () => {
    logOutButton.triggerEventHandler('click', null);
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_out/');
    request.flush({});
    expect(localStorage.getItem('taxi.token')).toBeNull();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
