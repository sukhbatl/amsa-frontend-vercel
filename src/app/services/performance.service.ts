import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private successSubject = new BehaviorSubject<string | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public success$ = this.successSubject.asObservable();

  constructor() {
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  /**
   * Set success message
   */
  setSuccess(success: string | null): void {
    this.successSubject.next(success);
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.errorSubject.next(null);
    this.successSubject.next(null);
  }

  /**
   * Optimize image loading
   */
  optimizeImage(imageUrl: string, width?: number, height?: number): string {
    // Add query parameters for optimization
    const url = new URL(imageUrl);
    
    if (width) {
      url.searchParams.set('w', width.toString());
    }
    if (height) {
      url.searchParams.set('h', height.toString());
    }
    
    // Add quality parameter
    url.searchParams.set('q', '80');
    
    // Add format optimization
    url.searchParams.set('f', 'webp');
    
    return url.toString();
  }

  /**
   * Preload critical resources
   */
  preloadResource(href: string, as: string, type?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      
      if (type) {
        link.type = type;
      }
      
      if (as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload ${href}`));
      
      document.head.appendChild(link);
    });
  }

  /**
   * Lazy load images
   */
  setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset['src']) {
              img.src = img.dataset['src'];
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would require the web-vitals library
      // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
    }

    // Monitor loading performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // Track performance metrics
        this.trackPerformanceMetric('page_load_time', loadTime);
      }
    });

    // Monitor image loading performance
    document.addEventListener('DOMContentLoaded', () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('load', () => {
          this.trackPerformanceMetric('image_loaded', 1);
        });
        
        img.addEventListener('error', () => {
          this.trackPerformanceMetric('image_error', 1);
        });
      });
    });
  }

  /**
   * Track performance metrics
   */
  private trackPerformanceMetric(metric: string, value: number): void {
    // In a real application, you would send this to your analytics service
    console.log(`Performance Metric - ${metric}: ${value}`);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: value
      });
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): any {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      navigation: navigation ? {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      } : null,
      paint: paint.reduce((acc, entry) => {
        acc[entry.name] = entry.startTime;
        return acc;
      }, {} as any)
    };
  }

  /**
   * Optimize bundle size by code splitting
   */
  async loadComponent(componentPath: string): Promise<any> {
    try {
      this.setLoading(true);
      const module = await import(componentPath);
      this.setLoading(false);
      return module;
    } catch (error) {
      this.setError(`Failed to load component: ${componentPath}`);
      this.setLoading(false);
      throw error;
    }
  }
}
