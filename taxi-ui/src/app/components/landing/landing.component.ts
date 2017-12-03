import { Component } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  constructor(private authService: AuthService) {}
  hasToken(): boolean {
    return this.authService.hasToken();
  }
  isDriver(): boolean {
    return User.isDriver();
  }
  isRider(): boolean {
    return User.isRider();
  }
  logOut(): void {
    this.authService.logOut(this.authService.getToken()).subscribe(() => {}, (error) => {
      console.error(error);
    });
  }
}
