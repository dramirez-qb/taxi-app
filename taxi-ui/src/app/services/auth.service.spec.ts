import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '../models/user';
import { AuthService } from './auth.service';

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
    let responseData = {
      id: 1,
      username: 'rider@example.com',
      first_name: 'Test',
      last_name: 'User',
      group: 'rider',
      photo: 'http://localhost:8000/media/photos/photo_Q1fX8sA.png',
    };
    let photo: File = new File(['photo'], 'photo.jpg', {type: 'image/jpeg'});
    authService.signUp('rider@example.com', 'Test', 'User', 'pAssw0rd!', 'rider', photo).subscribe(user => {
      expect(user).toBe(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/sign_up/');
    request.flush(responseData);
  });
  it('should allow a user to log in to an existing account', () => {
    let responseData = {
      id: 1,
      username: 'rider@example.com',
      first_name: 'Test',
      last_name: 'User',
      group: 'rider',
      photo: 'http://localhost:8000/media/photos/photo_Q1fX8sA.png'
    };
    localStorage.clear();
    authService.logIn('rider@example.com', 'pAssw0rd!').subscribe(user => {
      expect(user).toBe(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_in/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toBe(JSON.stringify(responseData));
  });
  it('should allow a user to log out', () => {
    let responseData = {};
    localStorage.setItem('taxi.user', JSON.stringify({}));
    authService.logOut().subscribe(user => {
      expect(user).toEqual(responseData);
    });
    let request: TestRequest = httpMock.expectOne('http://localhost:8000/api/log_out/');
    request.flush(responseData);
    expect(localStorage.getItem('taxi.user')).toBeNull();
  });
  afterEach(() => {
    httpMock.verify();
  });
});
