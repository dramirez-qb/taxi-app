import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable()
export class AuthService {
  private BASE_URL = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}
  signUp(
    username: string,
    first_name: string,
    last_name: string,
    password: string,
    group: string,
    photo: any
  ): Observable<User> {
    const url = `${this.BASE_URL}/sign_up/`;
    const formData: FormData = new FormData();
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
    const url = `${this.BASE_URL}/log_in/`;
    return this.http.post<User>(url, {username, password}).pipe(
      tap(user => localStorage.setItem('taxi.user', JSON.stringify(user)))
    );
  }
  logOut(): Observable<any> {
    const url = `${this.BASE_URL}/log_out/`;
    return this.http.post(url, null).pipe(
      finalize(() => localStorage.removeItem('taxi.user'))
    );
  }
}
