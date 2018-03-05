import {
  HttpClientTestingModule, HttpTestingController, TestRequest
} from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { LogInComponent } from './log-in.component';

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ LogInComponent ],
      providers: [ AuthService ]
    });
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should allow a user to log into an existing account', () => {
    let spy: jasmine.Spy = spyOn(router, 'navigateByUrl');
    let responseData = User.create({
      id: 1,
      username: 'rider@example.com',
      first_name: 'Test',
      last_name: 'User',
      group: 'rider',
      photo: '/media/photos/photo.png',
      auth_token: '2df504b532e39a49e05b08b8ba718f7a327b8f76'
    });
    component.user = {username: 'rider@example.com', password: 'pAssw0rd!'};
    component.onSubmit();
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_in/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toEqual(JSON.stringify(responseData));
    expect(spy).toHaveBeenCalledWith('');
  });

  afterEach(() => {
    httpMock.verify();
  });

});
