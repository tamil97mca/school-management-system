import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from '../services/routing.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private routeService: RoutingService, private _snackBar: MatSnackBar) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let token = localStorage.getItem('token') || '';

      this.routeService.currentLayoutName.next(route.routeConfig?.path);
      let userStr = localStorage.getItem("LOGGED_IN_USER");
      let user = userStr != null ? JSON.parse(userStr) : [];

      if (user.email != null && user.role == "admin" && token) {
        return true;
      }
      else {
        this._snackBar.open('you are not authorized to access this page, Please reach admin', 'Ok', {
          duration: 3000
        });
        this.routeService.layoutNavigation('login');
        return false;
      }
  }

}
