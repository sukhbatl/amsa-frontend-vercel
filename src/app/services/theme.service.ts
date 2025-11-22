import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeModeSubject = new BehaviorSubject<ThemeMode>('auto');
  private contrastModeSubject = new BehaviorSubject<ContrastMode>('normal');
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  private isHighContrastSubject = new BehaviorSubject<boolean>(false);

  public themeMode$ = this.themeModeSubject.asObservable();
  public contrastMode$ = this.contrastModeSubject.asObservable();
  public isDarkMode$ = this.isDarkModeSubject.asObservable();
  public isHighContrast$ = this.isHighContrastSubject.asObservable();

  // Legacy compatibility properties
  public theme = this.themeModeSubject.asObservable().pipe(
    map(mode => mode === 'auto' ? 'auto' : mode)
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
      this.setupMediaQueryListeners();
    }
  }

  /**
   * Initialize theme from saved preferences or system settings
   */
  private initializeTheme(): void {
    // Get saved preferences
    const savedThemeMode = isPlatformBrowser(this.platformId) ? 
      (localStorage.getItem('theme-mode') as ThemeMode) : null;
    const savedContrastMode = isPlatformBrowser(this.platformId) ? 
      (localStorage.getItem('contrast-mode') as ContrastMode) : null;

    // Set theme mode
    const themeMode = savedThemeMode || 'auto';
    this.setThemeMode(themeMode);

    // Set contrast mode
    const contrastMode = savedContrastMode || 'normal';
    this.setContrastMode(contrastMode);

    // Apply initial theme
    this.applyTheme();
  }

  /**
   * Setup media query listeners for system preferences
   */
  private setupMediaQueryListeners(): void {
    // Listen for dark mode preference changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

      darkModeQuery.addEventListener('change', (e) => {
        if (this.themeModeSubject.value === 'auto') {
          this.updateDarkMode(e.matches);
        }
      });

      highContrastQuery.addEventListener('change', (e) => {
        if (this.contrastModeSubject.value === 'normal') {
          this.updateHighContrast(e.matches);
        }
      });

      // Set initial values
      this.updateDarkMode(darkModeQuery.matches);
      this.updateHighContrast(highContrastQuery.matches);
    }
  }

  /**
   * Set theme mode
   */
  setThemeMode(mode: ThemeMode): void {
    this.themeModeSubject.next(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme-mode', mode);
    }
    this.applyTheme();
  }

  /**
   * Legacy compatibility method
   */
  setTheme(theme: string): void {
    // Map legacy theme values to new ThemeMode
    let mode: ThemeMode;
    switch (theme) {
      case 'dark':
        mode = 'dark';
        break;
      case 'light':
        mode = 'light';
        break;
      default:
        mode = 'auto';
    }
    this.setThemeMode(mode);
  }

  /**
   * Set contrast mode
   */
  setContrastMode(mode: ContrastMode): void {
    this.contrastModeSubject.next(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('contrast-mode', mode);
    }
    this.applyTheme();
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    const currentMode = this.themeModeSubject.value;
    if (currentMode === 'auto') {
      this.setThemeMode('light');
    } else if (currentMode === 'light') {
      this.setThemeMode('dark');
    } else {
      this.setThemeMode('auto');
    }
  }

  /**
   * Toggle contrast mode
   */
  toggleContrast(): void {
    const currentMode = this.contrastModeSubject.value;
    this.setContrastMode(currentMode === 'normal' ? 'high' : 'normal');
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const themeMode = this.themeModeSubject.value;
    const contrastMode = this.contrastModeSubject.value;

    // Determine if dark mode should be active
    let isDarkMode = false;
    if (themeMode === 'dark') {
      isDarkMode = true;
    } else if (themeMode === 'auto') {
      isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Determine if high contrast should be active
    let isHighContrast = false;
    if (contrastMode === 'high') {
      isHighContrast = true;
    } else if (contrastMode === 'normal') {
      isHighContrast = window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches;
    }

    // Update subjects
    this.isDarkModeSubject.next(isDarkMode);
    this.isHighContrastSubject.next(isHighContrast);

    // Apply classes to document
    const body = document.body;
    const html = document.documentElement;

    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme', 'high-contrast');
    html.classList.remove('light-theme', 'dark-theme', 'high-contrast');

    // Add new theme classes
    if (isDarkMode) {
      body.classList.add('dark-theme');
      html.classList.add('dark-theme');
    } else {
      body.classList.add('light-theme');
      html.classList.add('light-theme');
    }

    if (isHighContrast) {
      body.classList.add('high-contrast');
      html.classList.add('high-contrast');
    }

    // Update CSS custom properties
    this.updateCSSVariables(isDarkMode, isHighContrast);

    // Announce theme change to screen readers
    this.announceThemeChange(isDarkMode, isHighContrast);
  }

  /**
   * Update CSS custom properties based on theme
   */
  private updateCSSVariables(isDarkMode: boolean, isHighContrast: boolean): void {
    const root = document.documentElement;

    if (isDarkMode) {
      root.style.setProperty('--bg-primary', '#121212');
      root.style.setProperty('--bg-secondary', '#1e1e1e');
      root.style.setProperty('--bg-elevated', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#e0e0e0');
      root.style.setProperty('--text-disabled', '#757575');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#fafafa');
      root.style.setProperty('--bg-elevated', '#ffffff');
      root.style.setProperty('--text-primary', '#212121');
      root.style.setProperty('--text-secondary', '#424242');
      root.style.setProperty('--text-disabled', '#9e9e9e');
    }

    if (isHighContrast) {
      root.style.setProperty('--primary-color', '#000000');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#000000');
      root.style.setProperty('--focus-color', '#000000');
      root.style.setProperty('--focus-outline', '3px solid #000000');
    }
  }

  /**
   * Update dark mode state
   */
  private updateDarkMode(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
  }

  /**
   * Update high contrast state
   */
  private updateHighContrast(isHighContrast: boolean): void {
    this.isHighContrastSubject.next(isHighContrast);
  }

  /**
   * Announce theme change to screen readers
   */
  private announceThemeChange(isDarkMode: boolean, isHighContrast: boolean): void {
    const themeDescription = isDarkMode ? 'dark' : 'light';
    const contrastDescription = isHighContrast ? 'high contrast' : 'normal contrast';
    const announcement = `Theme changed to ${themeDescription} mode with ${contrastDescription}`;

    // Create a temporary element to announce the change
    const announcementElement = document.createElement('div');
    announcementElement.setAttribute('aria-live', 'polite');
    announcementElement.setAttribute('aria-atomic', 'true');
    announcementElement.className = 'sr-only';
    announcementElement.textContent = announcement;

    document.body.appendChild(announcementElement);

    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcementElement)) {
        document.body.removeChild(announcementElement);
      }
    }, 1000);
  }

  /**
   * Get current theme mode
   */
  getCurrentThemeMode(): ThemeMode {
    return this.themeModeSubject.value;
  }

  /**
   * Get current contrast mode
   */
  getCurrentContrastMode(): ContrastMode {
    return this.contrastModeSubject.value;
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  /**
   * Check if high contrast is active
   */
  isHighContrast(): boolean {
    return this.isHighContrastSubject.value;
  }

  /**
   * Get theme description for accessibility
   */
  getThemeDescription(): string {
    const isDark = this.isDarkMode();
    const isHighContrast = this.isHighContrast();
    
    let description = isDark ? 'Dark' : 'Light';
    if (isHighContrast) {
      description += ' high contrast';
    }
    
    return description + ' theme';
  }
}