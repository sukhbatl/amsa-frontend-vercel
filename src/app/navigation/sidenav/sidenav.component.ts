import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { themes } from '../../global/global.variables';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  imports: [CommonModule, ButtonModule, MenuModule, FormsModule, RouterLink],
})
export class SidenavComponent implements OnInit, OnDestroy {
  themeName: string = '';
  themeText: string = '';
  theme: Observable<string> | undefined;
  themes = themes;
  showSubmenu: boolean = false;
  userIsAuthenticated = false;
  private authStateListenerSubs?: Subscription;
  @Output() closeSidenav = new EventEmitter<void>();

  translationText$: Observable<any>;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
  }

  changeTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  changeLanguage() {
    this.languageService.toggleLanguage();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.onClose();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.theme = this.themeService.theme;
    this.theme.subscribe(s => {
      if (s === 'indigo-light-theme') {
        this.themeName = this.themes[0].name;
        this.themeText = this.themes[0].text;
      } else {
        this.themeName = this.themes[1].name;
        this.themeText = this.themes[1].text;
      }
    });

    // Get initial auth state
    this.userIsAuthenticated = this.authService.getIsAuth();

    // Listen for auth state changes
    this.authStateListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  ngOnDestroy() {
    this.authStateListenerSubs?.unsubscribe();
  }
}
