import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AuthService ]
    });
    authService = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should allow a user to sign up', () => {
    let responseData = {
      id: 1,
      username: 'rider@example.com',
      groups: ['rider']
    };
    authService.signUp('rider@example.com', 'pAssw0rd!', 'rider').subscribe(data => {
      expect(data).toEqual(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/sign_up/');
    request.flush(responseData);
  });

  it('should allow a user to log in', () => {
    let responseData = {
      id: 1,
      username: 'rider@example.com',
      groups: ['rider'],
      auth_token: '2df504b532e39a49e05b08b8ba718f7a327b8f76'
    };
    authService.logIn('rider@example.com', 'pAssw0rd!').subscribe(data => {
      expect(data).toEqual(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_in/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toEqual(JSON.stringify(responseData));
  });

  it('should allow a user to log out', () => {
    let token: string = '2df504b532e39a49e05b08b8ba718f7a327b8f76';
    let responseData = {};
    authService.logOut(token).subscribe(data => {
      expect(data).toEqual(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_out/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toBeNull();
  });

  it('should get a token', () => {
    let token: string = '2df504b532e39a49e05b08b8ba718f7a327b8f76';
    localStorage.setItem('taxi.user', JSON.stringify({
      auth_token: token
    }));
    expect(authService.getToken()).toEqual(token);
  });

  it('should check that a token exists', () => {
    localStorage.clear();
    expect(authService.hasToken()).toBeFalsy();
    localStorage.setItem('taxi.user', JSON.stringify({
      auth_token: '2df504b532e39a49e05b08b8ba718f7a327b8f76'
    }));
    expect(authService.hasToken()).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
