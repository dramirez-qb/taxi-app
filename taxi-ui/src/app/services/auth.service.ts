import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export class User {
  constructor(
    public id?: number,
    public username?: string,
    public first_name?: string,
    public last_name?: string,
    public group?: string,
    public photo?: any
  ) {}
  static create(data: any): User {
    return new User(
      data.id,
      data.username,
      data.first_name,
      data.last_name,
      data.group,
      data.photo
    );
  }
  static getUser(): User {
    const userData: string = localStorage.getItem('taxi.user');
    if (userData) {
      return User.create(JSON.parse(userData));
    }
    return null;
  }
  static isDriver(): boolean {
    const user: User = User.getUser();
    if (user === null) {
      return false;
    }
    return user.group === 'driver';
  }
  static isRider(): boolean {
    const user: User = User.getUser();
    if (user === null) {
      return false;
    }
    return user.group === 'rider';
  }
}

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
