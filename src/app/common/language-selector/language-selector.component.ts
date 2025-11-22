import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconModule } from 'primeng/iconss';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { EnhancedLanguageService, Language } from '../../services/enhanced-language.service';

@Component({
  selector: 'amsa-language-selector',
  standalone: true,
  imports: [CommonModule, ButtonModule, IconModule, MatMenuModule, MatTooltipModule],
  template: `
    <button 
      mat-button 
      [matMenuTriggerFor]="languageMenu" 
      class="language-selector"
      [attr.aria-label]="'Current language: ' + currentLanguage?.nativeName + '. Click to change language'"
      [attr.aria-expanded]="isMenuOpen"
      (click)="onMenuOpen()">
      
      <img 
        [src]="currentLanguage?.flag" 
        [alt]="currentLanguage?.nativeName + ' flag'"
        class="language-flag"
        width="24"
        height="18">
      
      <span class="language-name">{{currentLanguage?.nativeName}}</span>
      
      <mat-icon class="dropdown-icon">keyboard_arrow_down</mat-icon>
    </button>

    <mat-menu #languageMenu="matMenu" class="language-menu">
      <div class="language-menu-header">
        <h3 class="menu-title">Select Language</h3>
      </div>
      
      <button 
        mat-menu-item 
        *ngFor="let language of availableLanguages"
        (click)="changeLanguage(language.code)"
        [attr.aria-current]="language.code === currentLanguageCode ? 'true' : 'false'"
        [class.selected]="language.code === currentLanguageCode"
        class="language-option">
        
        <img 
          [src]="language.flag" 
          [alt]="language.nativeName + ' flag'"
          class="option-flag"
          width="20"
          height="15">
        
        <div class="option-text">
          <span class="option-native">{{language.nativeName}}</span>
          <span class="option-english">{{language.name}}</span>
        </div>
        
        <mat-icon *ngIf="language.code === currentLanguageCode" class="check-icon">check</mat-icon>
      </button>
    </mat-menu>
  `,
  styles: [`
    .language-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .language-selector:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .language-flag {
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    }

    .language-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .dropdown-icon {
      font-size: 18px;
      color: var(--text-secondary);
      transition: transform 0.2s ease;
    }

    .language-selector[aria-expanded="true"] .dropdown-icon {
      transform: rotate(180deg);
    }

    .language-menu {
      min-width: 200px;
    }

    .language-menu-header {
      padding: 16px 16px 8px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .menu-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      min-height: 48px;
      position: relative;
    }

    .language-option:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .language-option.selected {
      background-color: rgba(25, 118, 210, 0.08);
    }

    .option-flag {
      border-radius: 2px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .option-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
    }

    .option-native {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 14px;
    }

    .option-english {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .check-icon {
      color: var(--primary-color);
      font-size: 18px;
      margin-left: auto;
    }

    /* RTL Support */
    [dir="rtl"] .language-selector {
      flex-direction: row-reverse;
    }

    [dir="rtl"] .option-text {
      align-items: flex-end;
    }

    [dir="rtl"] .check-icon {
      margin-left: 0;
      margin-right: auto;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
      .language-selector {
        padding: 6px 12px;
        gap: 6px;
      }

      .language-name {
        display: none;
      }

      .language-menu {
        min-width: 180px;
      }

      .language-option {
        padding: 10px 12px;
        min-height: 44px;
      }
    }
  `]
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  currentLanguage: Language | undefined;
  currentLanguageCode: string = 'en';
  availableLanguages: Language[] = [];
  isMenuOpen: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private languageService: EnhancedLanguageService) {}

  ngOnInit(): void {
    // Subscribe to current language
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => {
        this.currentLanguageCode = code;
        this.currentLanguage = this.languageService.getCurrentLanguageObject();
      });

    // Subscribe to available languages
    this.languageService.availableLanguages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(languages => {
        this.availableLanguages = languages;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuOpen(): void {
    this.isMenuOpen = true;
  }

  async changeLanguage(languageCode: string): Promise<void> {
    try {
      await this.languageService.changeLanguage(languageCode);
      this.isMenuOpen = false;
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }
}
