import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable()
export class CouchdbInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('https://couch-express-api.onrender.com')) {

      let token = localStorage.getItem('token') || '';

      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        return next.handle(authReq).pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.authService.handleTokenExpiration();
            }
            return throwError(error);
          })
        );
      }
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.authService.handleTokenExpiration();
        }
        return throwError(error);
      })
    );
  }
}
