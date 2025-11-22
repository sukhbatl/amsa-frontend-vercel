import {Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ThemeService} from './services/theme.service';
import {Observable} from 'rxjs';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterModule, NavigationEnd} from '@angular/router';
import {AuthService} from './auth/auth.service';
import {ResponsiveService} from './services/responsive.service';
import {SEOService} from './services/seo.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TopnavComponent } from './navigation/topnav/topnav.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { FooterComponent } from './navigation/footer/footer.component';
import { AboutComponent } from './about/about.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MembersComponent } from './members/members.component';
import { LandingComponent } from './landing/landing.component';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        CommonModule,
        DrawerModule,
        RouterModule,
        ProgressSpinnerModule,
        ToastModule,
        TopnavComponent,
        SidenavComponent,
        FooterComponent,
        // AboutComponent,
        FontAwesomeModule,
        // MembersComponent,
        // LandingComponent,
    ]
})
export class AppComponent implements OnInit  {
  theme!: Observable<string>;
  loadingRouteConfig!: boolean;
  isMobile = false;
  sideNav = 'side';
  sidebarVisible = false;
  private readonly library = inject(FaIconLibrary);
  
  constructor(
      private themeService: ThemeService,
      private router: Router,
      private authService: AuthService,
      private responsiveService: ResponsiveService,
      private seoService: SEOService,
      @Inject(PLATFORM_ID) private platformId: Object,
      
    ) { }

  ngOnInit() {
    this.library.addIcons(
      faArrowLeft,
      faArrowRight,
    );

    if (isPlatformBrowser(this.platformId)) {
      const theme = localStorage.getItem('theme');
      if (theme) {
        this.themeService.setTheme(theme);
      }
      this.theme = this.themeService.theme;

      this.responsiveService.getMobileStatus().subscribe(isMobile => {
        this.isMobile = isMobile;
        if (isMobile) {
          this.sideNav = 'over';
        } else {
          this.sideNav = 'side';
        }
      });
    }
    this.onResize();

    // Auto login
    this.authService.autoAuthUser();

    // Router loading
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouteConfig = false;
      }
    });

    // SEO: Update meta tags on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateSEOForRoute(event.url);
      });

    // Set initial SEO
    this.seoService.setHomePageSEO();
  }

  onResize() {
    this.responsiveService.checkWidth();
  }

  private updateSEOForRoute(url: string): void {
    // Update SEO based on current route
    if (url === '/' || url === '') {
      this.seoService.setHomePageSEO();
    } else if (url.includes('/about')) {
      this.seoService.setAboutPageSEO();
    } else if (url.includes('/members')) {
      this.seoService.setTeamPageSEO();
    } else if (url.includes('/work/agm')) {
      this.seoService.setProjectSEO('agm');
    } else if (url.includes('/work/buop')) {
      this.seoService.setProjectSEO('buop');
    } else if (url.includes('/work/podcast')) {
      this.seoService.setProjectSEO('podcast');
    } else if (url.includes('/post/')) {
      // For individual posts, you would fetch post data and call setPostSEO
      // This would require additional logic to get post data
      this.seoService.updateSEO({
        title: 'AMSA Post - Association of Mongolian Students in America',
        description: 'Read this AMSA post about Mongolian students and community updates.',
        type: 'article'
      });
    } else {
      // Default SEO for other pages
      this.seoService.updateSEO({
        title: 'AMSA - Association of Mongolian Students in America',
        description: 'Connecting over 600 Mongolian students pursuing higher education in the US.',
        type: 'website'
      });
    }
  }
}
