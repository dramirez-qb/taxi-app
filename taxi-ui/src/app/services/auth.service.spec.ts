import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserFactory } from '../tests/factories';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [ AuthService ]
    });
    authService = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });
  it('should allow a user to sign up for a new account', () => {
    const userData = UserFactory.create();
    const responseData = userData;
    const photo: File = new File(['photo'], userData.photo, {type: 'image/jpeg'});
    authService.signUp(
      userData.username,
      userData.first_name,
      userData.last_name,
      'pAssw0rd!',
      userData.group,
      photo
    ).subscribe(user => {
      expect(user).toBe(responseData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/sign_up/');
    request.flush(responseData);
  });
  it('should allow a user to log in to an existing account', () => {
    const userData = UserFactory.create();
    const responseData = userData;
    localStorage.clear();
    authService.logIn(userData.username, 'pAssw0rd!').subscribe(user => {
      expect(user).toBe(responseData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_in/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toBe(JSON.stringify(responseData));
  });
  it('should allow a user to log out', () => {
    const responseData = {};
    localStorage.setItem('taxi.user', JSON.stringify({}));
    authService.logOut().subscribe(user => {
      expect(user).toEqual(responseData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_out/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toBeNull();
  });
  afterEach(() => {
    httpMock.verify();
  });
});
