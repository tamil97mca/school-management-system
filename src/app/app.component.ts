import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { RoutingService } from './services/routing.service';
import { AuthService } from './services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  userDetail!: any;
  layoutDetail: any;
  layoutSubscription!: Subscription;
  private subscription!: Subscription;
  constructor(private renderer: Renderer2, private el: ElementRef, private apiService: ApiService,
    public routeService: RoutingService, public authService: AuthService) {}
  ngOnInit() {

     this.subscription = this.apiService.loginSubject.subscribe((user: Observable<any>) => {
      this.userDetail = user;
      console.log('Received user data:', this.userDetail);
    });

    this.layoutSubscription = this.routeService.currentLayoutName.subscribe((layoutName: Observable<any>) => {
      this.layoutDetail = layoutName;
    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeNavbar(navigateURL: string) {
    const navbarCollapse = this.el.nativeElement.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
      this.renderer.removeClass(navbarCollapse, 'show');
    }

    if (navigateURL === 'login') {
      this.routeService.layoutNavigation('login')
    } else if (navigateURL === 'home') {
      this.routeService.layoutNavigation('home')
    } else if (navigateURL === 'logout'){
      this.routeService.layoutNavigation('logout')
    } else if (navigateURL === "student-list") {
      this.routeService.layoutNavigation('student-list')
    }

  }

  ngAfterViewInit() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const navbarHeight = navbar.clientHeight;
      this.renderer.setStyle(this.el.nativeElement, 'margin-top', navbarHeight + 'px');
    }
  }

}
