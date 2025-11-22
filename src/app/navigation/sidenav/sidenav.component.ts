import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { themes } from '../../global/global.variables';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    imports: [
        CommonModule,
        ButtonModule,
        MenuModule,
        FormsModule,
        RouterLink,
    ]
})
export class SidenavComponent implements OnInit {
  themeName: string = '';
  themeText: string = '';
  theme: Observable<string> | undefined;
  themes = themes;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  @Output() closeSidenav = new EventEmitter<void>();


  translationText$: Observable<any>;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
  }

  changeTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  changeLanguage() {
    this.languageService.toggleLanguage();
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
  }

  onClose() {
    this.closeSidenav.emit();
  }
}
