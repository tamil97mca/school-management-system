import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoutingService } from '../services/routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private routeService: RoutingService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      this.routeService.currentLayoutName.next(route.routeConfig?.path);
      let userStr = localStorage.getItem("LOGGED_IN_USER");
      let user = userStr != null ? JSON.parse(userStr) : [];

      if (user.email != null && user.role == "admin") {
        return true;
      }
      else {
        alert("you are not authorized to access this page");
        this.routeService.layoutNavigation('login');
        return false;
      }
  }

}
