import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(public route: Router, private apiService: ApiService) { }

  currentLayoutName = new BehaviorSubject<any>(null);

  layoutNavigation(layoutName: string, queryParams?: any) {
    if (layoutName === 'logout') {

      if (confirm('Are you sure want to logout ?')) {
      localStorage.removeItem("LOGGED_IN_USER");
      localStorage.removeItem("token");
      this.apiService.loginSubject.next(null);
      this.route.navigate(['home'], { queryParams: queryParams});
      }
    }
    else if (layoutName !== 'logout') {
      this.route.navigate([`${layoutName}`], { queryParams: queryParams});
    }
  }
}
