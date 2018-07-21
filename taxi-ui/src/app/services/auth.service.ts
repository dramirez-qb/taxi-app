import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { User } from '../models/user';

@Injectable()
export class AuthService {
  private BASE_URL: string = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}
  signUp(
    username: string,
    first_name: string,
    last_name: string,
    password: string,
    group: string,
    photo: any
  ): Observable<User> {
    let url: string = `${this.BASE_URL}/sign_up/`;
    let formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('password1', password);
    formData.append('password2', password);
    formData.append('group', group);
    formData.append('photo', photo);
    return this.http.request<User>('POST', url, {body: formData});
  }
  logIn(username: string, password: string): Observable<User> {
    let url: string = `${this.BASE_URL}/log_in/`;
    return this.http.post<User>(url, {username, password})
      .do(user => localStorage.setItem('taxi.user', JSON.stringify(user)));
  }
  logOut(): Observable<any> {
    let url: string = `${this.BASE_URL}/log_out/`;
    return this.http.post(url, null)
      .finally(() => localStorage.removeItem('taxi.user'));
  }
}
