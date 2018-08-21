import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';
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
    const photo: File = new File(['photo'], userData.photo, {type: 'image/jpeg'});
    authService.signUp(
      userData.username,
      userData.first_name,
      userData.last_name,
      'pAssw0rd!',
      userData.group,
      photo
    ).subscribe(user => {
      expect(user).toBe(userData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/sign_up/');
    request.flush(userData);
  });
  it('should allow a user to log in to an existing account', () => {
    const userData = UserFactory.create();
    localStorage.clear();
    authService.logIn(userData.username, 'pAssw0rd!').subscribe(user => {
      expect(user).toBe(userData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_in/');
    request.flush(userData);
    expect(localStorage.getItem('taxi.user')).toBe(JSON.stringify(userData));
  });
  it('should allow a user to log out', () => {
    const userData = {};
    localStorage.setItem('taxi.user', JSON.stringify({}));
    authService.logOut().subscribe(user => {
      expect(user).toEqual(userData);
    });
    const request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_out/');
    request.flush(userData);
    expect(localStorage.getItem('taxi.user')).toBeNull();
  });
  it('should determine whether a user is logged in', () => {
    localStorage.clear();
    expect(User.getUser()).toBeFalsy();
    localStorage.setItem('taxi.user', JSON.stringify(
      UserFactory.create()
    ));
    expect(User.getUser()).toBeTruthy();
  });
  afterEach(() => {
    httpMock.verify();
  });
});
