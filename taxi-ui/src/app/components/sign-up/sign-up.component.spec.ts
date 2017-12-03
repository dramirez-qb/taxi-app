import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LogInComponent } from '../log-in/log-in.component';
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'log-in', component: LogInComponent }
        ])
      ],
      declarations: [ LogInComponent, SignUpComponent ],
      providers: [ AuthService ]
    });
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
  });

  it('should allow a user to sign up for an account', () => {
    let responseData = {
      id: 1,
      username: 'rider@example.com',
      groups: ['rider']
    };
    component.user = {username: 'rider@example.com', password: 'pAssw0rd!', group: 'rider'};
    component.onSubmit();
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/sign_up/');
    request.flush(responseData);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
