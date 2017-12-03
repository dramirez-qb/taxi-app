import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

class UserData {
  constructor(
    public username?: string,
    public password?: string,
    public group?: string
  ) {}
}

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent {
  user: UserData = new UserData();
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  onSubmit(): void {
    this.authService.signUp(
      this.user.username,
      this.user.password,
      this.user.group
    ).subscribe(() => {
      this.router.navigateByUrl('/log-in');
    }, (error) => {
      console.error(error);
    });
  }
}
