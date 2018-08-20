import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { User } from '../services/auth.service';

@Injectable()
export class IsRider implements CanActivate {
  canActivate(): boolean {
    return User.isRider();
  }
}
