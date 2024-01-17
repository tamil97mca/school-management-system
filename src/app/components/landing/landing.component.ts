import { Component } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  constructor(private routeService: RoutingService) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    })
  }

  gotoLoginPage() {
    this.routeService.layoutNavigation('login');
  }
}
