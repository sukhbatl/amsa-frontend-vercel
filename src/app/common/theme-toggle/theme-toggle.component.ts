import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconModule } from 'primeng/iconss';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, ThemeMode, ContrastMode } from '../../services/theme.service';

@Component({
  selector: 'amsa-theme-toggle',
  standalone: true,
  imports: [CommonModule, ButtonModule, IconModule, MatMenuModule, MatTooltipModule],
  template: `
    <button 
      mat-icon-button 
      [matMenuTriggerFor]="themeMenu" 
      class="theme-toggle"
      [attr.aria-label]="'Current theme: ' + themeDescription + '. Click to change theme'"
      [attr.aria-expanded]="isMenuOpen"
      (click)="onMenuOpen()">
      
      <mat-icon class="theme-icon">{{currentIcon}}</mat-icon>
    </button>

    <mat-menu #themeMenu="matMenu" class="theme-menu">
      <div class="theme-menu-header">
        <h3 class="menu-title">Theme Settings</h3>
      </div>
      
      <div class="theme-section">
        <h4 class="section-title">Color Mode</h4>
        <button 
          mat-menu-item 
          *ngFor="let mode of themeModes"
          (click)="setThemeMode(mode.value)"
          [attr.aria-current]="mode.value === currentThemeMode ? 'true' : 'false'"
          [class.selected]="mode.value === currentThemeMode"
          class="theme-option">
          
          <mat-icon class="option-icon">{{mode.icon}}</mat-icon>
          <div class="option-text">
            <span class="option-name">{{mode.name}}</span>
            <span class="option-description">{{mode.description}}</span>
          </div>
          <mat-icon *ngIf="mode.value === currentThemeMode" class="check-icon">check</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="theme-section">
        <h4 class="section-title">Contrast</h4>
        <button 
          mat-menu-item 
          *ngFor="let mode of contrastModes"
          (click)="setContrastMode(mode.value)"
          [attr.aria-current]="mode.value === currentContrastMode ? 'true' : 'false'"
          [class.selected]="mode.value === currentContrastMode"
          class="theme-option">
          
          <mat-icon class="option-icon">{{mode.icon}}</mat-icon>
          <div class="option-text">
            <span class="option-name">{{mode.name}}</span>
            <span class="option-description">{{mode.description}}</span>
          </div>
          <mat-icon *ngIf="mode.value === currentContrastMode" class="check-icon">check</mat-icon>
        </button>
      </div>
    </mat-menu>
  `,
  styles: [`
    .theme-toggle {
      color: var(--text-primary);
      transition: color 0.2s ease;
    }

    .theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .theme-icon {
      font-size: 20px;
      transition: transform 0.2s ease;
    }

    .theme-toggle[aria-expanded="true"] .theme-icon {
      transform: rotate(180deg);
    }

    .theme-menu {
      min-width: 250px;
    }

    .theme-menu-header {
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

    .theme-section {
      padding: 8px 0;
    }

    .section-title {
      margin: 0 0 8px 0;
      padding: 0 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      min-height: 40px;
      position: relative;
    }

    .theme-option:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .theme-option.selected {
      background-color: rgba(25, 118, 210, 0.08);
    }

    .option-icon {
      font-size: 18px;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .option-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
    }

    .option-name {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 14px;
    }

    .option-description {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .check-icon {
      color: var(--primary-color);
      font-size: 18px;
      margin-left: auto;
    }

    /* Dark theme adjustments */
    .dark-theme .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.04);
    }

    .dark-theme .theme-option:hover {
      background-color: rgba(255, 255, 255, 0.04);
    }

    .dark-theme .theme-option.selected {
      background-color: rgba(25, 118, 210, 0.12);
    }

    /* High contrast adjustments */
    .high-contrast .theme-toggle {
      border: 2px solid var(--text-primary);
    }

    .high-contrast .theme-option {
      border-bottom: 1px solid var(--text-primary);
    }

    .high-contrast .theme-option:last-child {
      border-bottom: none;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
      .theme-menu {
        min-width: 200px;
      }

      .theme-option {
        padding: 6px 12px;
        min-height: 36px;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentThemeMode: ThemeMode = 'auto';
  currentContrastMode: ContrastMode = 'normal';
  isDarkMode: boolean = false;
  isHighContrast: boolean = false;
  isMenuOpen: boolean = false;
  themeDescription: string = '';

  themeModes = [
    {
      value: 'light' as ThemeMode,
      name: 'Light',
      description: 'Always use light theme',
      icon: 'light_mode'
    },
    {
      value: 'dark' as ThemeMode,
      name: 'Dark',
      description: 'Always use dark theme',
      icon: 'dark_mode'
    },
    {
      value: 'auto' as ThemeMode,
      name: 'Auto',
      description: 'Follow system preference',
      icon: 'brightness_auto'
    }
  ];

  contrastModes = [
    {
      value: 'normal' as ContrastMode,
      name: 'Normal',
      description: 'Standard contrast',
      icon: 'contrast'
    },
    {
      value: 'high' as ContrastMode,
      name: 'High',
      description: 'High contrast for better visibility',
      icon: 'high_contrast'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.themeMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => {
        this.currentThemeMode = mode;
        this.updateThemeDescription();
      });

    this.themeService.contrastMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => {
        this.currentContrastMode = mode;
        this.updateThemeDescription();
      });

    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
        this.updateThemeDescription();
      });

    this.themeService.isHighContrast$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isHighContrast => {
        this.isHighContrast = isHighContrast;
        this.updateThemeDescription();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuOpen(): void {
    this.isMenuOpen = true;
  }

  setThemeMode(mode: ThemeMode): void {
    this.themeService.setThemeMode(mode);
    this.isMenuOpen = false;
  }

  setContrastMode(mode: ContrastMode): void {
    this.themeService.setContrastMode(mode);
    this.isMenuOpen = false;
  }

  private updateThemeDescription(): void {
    this.themeDescription = this.themeService.getThemeDescription();
  }

  get currentIcon(): string {
    if (this.currentThemeMode === 'auto') {
      return 'brightness_auto';
    } else if (this.currentThemeMode === 'dark') {
      return 'dark_mode';
    } else {
      return 'light_mode';
    }
  }
}
