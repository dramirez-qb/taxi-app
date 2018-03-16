import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';

const ALLOW_ANY_PATHS: RegExp[] = [
  /\/api\/sign_up\/$/,
  /\/api\/log_in\/$/
];

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: AuthService;
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthService);
    let token: string = this.authService.getToken();
    let matchesAllowAny: boolean = false;
    for (let pattern of ALLOW_ANY_PATHS) {
      if (pattern.test(request.url)) {
        matchesAllowAny = true;
        break;
      }
    }
    if (!matchesAllowAny) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
