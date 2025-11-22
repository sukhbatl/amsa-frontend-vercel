import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  currency: string;
}

export interface TranslationText {
  [key: string]: string | TranslationText;
}

@Injectable({
  providedIn: 'root'
})
export class EnhancedLanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  private translationTextSubject = new BehaviorSubject<TranslationText>({});
  private availableLanguagesSubject = new BehaviorSubject<Language[]>([]);

  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  public translationText$ = this.translationTextSubject.asObservable();
  public availableLanguages$ = this.availableLanguagesSubject.asObservable();

  private readonly defaultLanguage = 'en';
  private readonly supportedLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg',
      direction: 'ltr',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    {
      code: 'mn',
      name: 'Mongolian',
      nativeName: 'Монгол',
      flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/MN.svg',
      direction: 'ltr',
      dateFormat: 'YYYY-MM-DD',
      currency: 'MNT'
    }
  ];

  constructor(private http: HttpClient) {
    this.initializeLanguage();
  }

  /**
   * Initialize language service
   */
  private async initializeLanguage(): Promise<void> {
    // Set available languages
    this.availableLanguagesSubject.next(this.supportedLanguages);

    // Get saved language or detect from browser
    const savedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = this.detectBrowserLanguage();
    const initialLanguage = savedLanguage || browserLanguage || this.defaultLanguage;

    // Load translations
    await this.loadTranslations(initialLanguage);
    this.currentLanguageSubject.next(initialLanguage);

    // Set document direction
    this.setDocumentDirection(initialLanguage);
  }

  /**
   * Detect browser language
   */
  private detectBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const langCode = browserLang.split('-')[0];
    
    return this.supportedLanguages.find(lang => lang.code === langCode)?.code || this.defaultLanguage;
  }

  /**
   * Load translations for a language
   */
  private async loadTranslations(languageCode: string): Promise<void> {
    try {
      const translations = await this.http.get<TranslationText>(`/assets/i18n/${languageCode}.json`).toPromise();
      this.translationTextSubject.next(translations || {});
    } catch (error) {
      console.warn(`Failed to load translations for ${languageCode}, falling back to English`);
      if (languageCode !== this.defaultLanguage) {
        await this.loadTranslations(this.defaultLanguage);
      }
    }
  }

  /**
   * Change language
   */
  async changeLanguage(languageCode: string): Promise<void> {
    if (!this.supportedLanguages.find(lang => lang.code === languageCode)) {
      console.warn(`Language ${languageCode} is not supported`);
      return;
    }

    try {
      // Save preference
      localStorage.setItem('preferred-language', languageCode);
      
      // Load translations
      await this.loadTranslations(languageCode);
      
      // Update current language
      this.currentLanguageSubject.next(languageCode);
      
      // Set document direction
      this.setDocumentDirection(languageCode);
      
      // Update document language
      document.documentElement.lang = languageCode;
      
      // Announce language change to screen readers
      this.announceLanguageChange(languageCode);
      
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /**
   * Get current language object
   */
  getCurrentLanguageObject(): Language | undefined {
    return this.supportedLanguages.find(lang => lang.code === this.getCurrentLanguage());
  }

  /**
   * Get translation text
   */
  getTranslation(key: string): string {
    const translations = this.translationTextSubject.value;
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Get translation with parameters
   */
  getTranslationWithParams(key: string, params: { [key: string]: string | number }): string {
    let translation = this.getTranslation(key);
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, String(params[param]));
    });
    
    return translation;
  }

  /**
   * Set document direction
   */
  private setDocumentDirection(languageCode: string): void {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    if (language) {
      document.documentElement.dir = language.direction;
    }
  }

  /**
   * Announce language change to screen readers
   */
  private announceLanguageChange(languageCode: string): void {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    if (language) {
      // Create a temporary element to announce the change
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Language changed to ${language.nativeName}`;
      
      document.body.appendChild(announcement);
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }

  /**
   * Format date according to current language
   */
  formatDate(date: Date): string {
    const language = this.getCurrentLanguageObject();
    if (!language) return date.toLocaleDateString();

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    return date.toLocaleDateString(language.code, options);
  }

  /**
   * Format currency according to current language
   */
  formatCurrency(amount: number): string {
    const language = this.getCurrentLanguageObject();
    if (!language) return `$${amount.toFixed(2)}`;

    return new Intl.NumberFormat(language.code, {
      style: 'currency',
      currency: language.currency
    }).format(amount);
  }

  /**
   * Get plural form
   */
  getPlural(key: string, count: number): string {
    const language = this.getCurrentLanguageObject();
    if (!language) return this.getTranslation(key);

    // Simple pluralization for English
    if (language.code === 'en') {
      if (count === 1) {
        return this.getTranslation(`${key}.one`);
      } else {
        return this.getTranslation(`${key}.other`);
      }
    }

    // For other languages, you might need more complex pluralization rules
    return this.getTranslation(key);
  }

  /**
   * Check if RTL language
   */
  isRTL(): boolean {
    const language = this.getCurrentLanguageObject();
    return language?.direction === 'rtl';
  }

  /**
   * Get text alignment class
   */
  getTextAlignClass(): string {
    return this.isRTL() ? 'text-right' : 'text-left';
  }
}
