import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';

const BASE_URL = 'http://localhost:8000/api';

@Injectable()
export class AuthService {
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) {}
  signUp(username: string, password: string, group: string): Observable<User> {
    let url: string = `${BASE_URL}/sign_up/`;
    return this.http.post<User>(url, {
      username,
      password1: password,
      password2: password,
      group
    }, {headers: this.headers});
  }
  logIn(username: string, password: string): Observable<User> {
    let url: string = `${BASE_URL}/log_in/`;
    return this.http.post<User>(url, {username, password}, {headers: this.headers})
      .do(user => localStorage.setItem('taxi.user', JSON.stringify(user)));
  }
  logOut(token): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
    let url: string = `${BASE_URL}/log_out/`;
    return this.http.post(url, null, {headers: headers})
      .do(() => localStorage.removeItem('taxi.user'));
  }
  getToken(): string {
    let user: User = User.getUser();
    if (user === null) {
      return null;
    }
    return user.auth_token;
  }
  hasToken(): boolean {
    return this.getToken() !== null;
  }
}
