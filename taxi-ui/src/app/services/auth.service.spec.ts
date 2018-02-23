import {
  HttpClientTestingModule, HttpTestingController, TestRequest
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user';


describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      // All module imports go here.
      imports: [ HttpClientTestingModule ],
      // All components are declared here.
      declarations: [],
      // All services are referenced here.
      providers: [ AuthService ]
    });
    authService = TestBed.get(AuthService);
  });
  it('should be created', () => {
    expect(authService).toBeTruthy();
  });
});

fdescribe('Authentication using a service', () => {
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
  afterEach(() => {
    httpMock.verify();
  });
  it('should allow a user to sign up for a new account', () => {
    // Set up the data.
    let responseData = User.create({
      id: 1,
      username: 'rider@example.com',
      first_name: 'Test',
      last_name: 'User',
      group: 'rider',
      photo: '/media/photos/photo.png'
    });
    let photo: File = new File(['photo'], 'photo.jpg', {type: 'image/jpeg'});
    // Execute the function under test.
    authService.signUp(
      'rider@example.com', 'Test', 'User', 'pAssw0rd!', 'rider', photo
    ).subscribe(user => {
      expect(user).toBe(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/sign_up/');
      request.flush(responseData);
  });
  it('should allow a user to log in to an existing account', () => {
    // Set up the data.
    let responseData = User.create({
      id: 1,
      username: 'rider@example.com',
      first_name: 'Test',
      last_name: 'User',
      group: 'rider',
      photo: '/media/photos/photo.png',
      auth_token: '2df504b532e39a49e05b08b8ba718f7a327b8f76'
    });
    // A successful login should write data to local storage.
    localStorage.clear();
    // Execute the function under test.
    authService.logIn(
      'rider@example.com', 'pAssw0rd!'
    ).subscribe(user => {
      expect(user).toBe(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_in/');
    request.flush(responseData);
    // Confirm that the expected data was written to local storage.
    expect(localStorage.getItem('taxi.user')).toBe(JSON.stringify(responseData));
  });
  it('should allow a user to log out', () => {
    // Set up the data.
    let responseData = {};
    let token = '2df504b532e39a49e05b08b8ba718f7a327b8f76';
    // A successful logout should delete local storage data.
    localStorage.setItem('taxi.user', JSON.stringify({}));
    // Execute the function under test.
    authService.logOut(token).subscribe(user => {
      expect(user).toEqual(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_out/');
    request.flush(responseData);
    // Confirm that the local storage data was deleted.
    expect(localStorage.getItem('taxi.user')).toBeNull();
  });
  it('should get the token of a logged in user, if one exists', () => {
    let token: string = '2df504b532e39a49e05b08b8ba718f7a327b8f76';
    localStorage.clear();
    expect(authService.getToken()).toBeNull();
    localStorage.setItem('taxi.user', JSON.stringify({
      auth_token: token
    }));
    expect(authService.getToken()).toBe(token);
  });
  it('should determine whether a user is logged in', () => {
    localStorage.clear();
    expect(authService.hasToken()).toBeFalsy();
    localStorage.setItem('taxi.user', JSON.stringify({
      auth_token: '2df504b532e39a49e05b08b8ba718f7a327b8f76'
    }));
    expect(authService.hasToken()).toBeTruthy();
  });
});
