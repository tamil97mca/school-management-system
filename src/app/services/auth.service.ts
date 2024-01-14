import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from './api.service';
import { Login } from '../modals/login';
import { RoutingService } from './routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token!: string;

  constructor(private jwtHelper: JwtHelperService, private apiService: ApiService, private routeService: RoutingService) { }

  login(loginDTO: Login) {
    return this.apiService.login(loginDTO);
  }

  register(loginDTO: Login) {
    return this.apiService.register(loginDTO);
  }

  isAuthenticated(): boolean {
    this.token = localStorage.getItem('token') || '';
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  handleTokenExpiration(): void {
    if (confirm('Session expired, please login again.')) {
      localStorage.removeItem("LOGGED_IN_USER");
      localStorage.removeItem("token");
      this.routeService.layoutNavigation('login');
    } else {
      localStorage.removeItem("LOGGED_IN_USER");
      localStorage.removeItem("token");
      this.routeService.layoutNavigation('home');
    }
  }

}
