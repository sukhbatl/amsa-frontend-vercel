import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { TitleService } from '../../services/title.service';
import { AuthService } from '../../auth/auth.service';
import { MenuItem, MessageService } from 'primeng/api';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    imports: [
        CommonModule,
        MenuModule,
        RouterLink,
        ButtonModule,
        MenubarModule,
    ]
})

export class TopnavComponent implements OnInit, OnDestroy {
  private authStateListenerSubs?: Subscription;
  private authLevelListenerSubs?: Subscription;
  userIsAuthenticated = false;
  userLevel = 0;
  theme: Observable<string>|undefined;
  title: Observable<string>|undefined;
  language: Observable<string>|undefined;
  languageText: string = '';
  @Output() sidenavToggle = new EventEmitter<void>();
  translationText$: Observable<any>;
  
  profileMenuItems: any[] = [];
  projectsMenuItems: any[] = [];
  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private titleService: TitleService,
    private messageService: MessageService,
    private languageService: LanguageService,
    private router: Router,
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
  }

  changeLanguage() {
    this.languageService.toggleLanguage();
  }

  logout() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Та амжилттай гарлаа!'
    });
  }

  initializeMenus() {
    this.projectsMenuItems = [
      {
        label: 'BUOP',
        icon: 'pi pi-graduation-cap',
        command: () => this.navigateTo('/work/buop')
      },
      {
        label: 'AGM',
        icon: 'pi pi-calendar',
        command: () => this.navigateTo('/work/agm')
      },
      {
        label: 'Podcasts',
        icon: 'pi pi-microphone',
        command: () => this.navigateTo('/work/podcast')
      }
    ];

    const allProfileMenuItems = [
      {
        label: 'Register',
        icon: 'pi pi-user-plus',
        command: () => this.navigateTo('/signup/member'),
        showWhen: () => !this.userIsAuthenticated
      },
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
        command: () => this.navigateTo('/login'),
        showWhen: () => !this.userIsAuthenticated
      },
      {
        label: 'My Account',
        icon: 'pi pi-user',
        command: () => this.navigateTo('/profile'),
        showWhen: () => this.userIsAuthenticated
      },
      {
        label: 'Admin',
        icon: 'pi pi-cog',
        command: () => this.navigateTo('/admin'),
        showWhen: () => this.userIsAuthenticated && this.userLevel >= 7
      },
      {
        label: 'My Class',
        icon: 'pi pi-calendar',
        command: () => this.navigateTo('/class_year'),
        showWhen: () => this.userIsAuthenticated
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
        showWhen: () => this.userIsAuthenticated
      }
    ];

    // Filter menu items based on current auth state
    this.profileMenuItems = allProfileMenuItems.filter(item => item.showWhen());
  }

  onToggleSideNav() {
    this.sidenavToggle.emit();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.theme = this.themeService.theme;
    this.title = this.titleService.title;
    this.language = this.languageService.currentLanguage;

    this.language.subscribe(l => {
      if (l === 'mongolian') {
        this.languageText = "MN";
      } else {
        this.languageText = "EN";
      }
    });

    // Get initial auth state
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userLevel = this.authService.getLevel();
    
    // Initialize menu items with current auth state
    this.initializeMenus();
    
    // Re-initialize menu items when auth state changes
    this.authStateListenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.initializeMenus();
      }
    );
    this.authLevelListenerSubs = this.authService.getAuthLevelListener().subscribe(
      level => {
        this.userLevel = level;
        this.initializeMenus();
      }
    );

    this.items = [
      {
          label: 'Options',
          items: [
              {
                  label: 'Refresh',
                  icon: 'pi pi-refresh'
              },
              {
                  label: 'Export',
                  icon: 'pi pi-upload'
              }
          ]
      }
    ];
  }

  

  ngOnDestroy() {
    this.authStateListenerSubs?.unsubscribe();
    this.authLevelListenerSubs?.unsubscribe();
  }
}
