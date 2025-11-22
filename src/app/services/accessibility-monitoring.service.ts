import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AccessibilityMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  timestamp: Date;
}

export interface AccessibilityReport {
  overallScore: number;
  metrics: AccessibilityMetric[];
  recommendations: string[];
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityMonitoringService {
  private metricsSubject = new BehaviorSubject<AccessibilityMetric[]>([]);
  private reportSubject = new BehaviorSubject<AccessibilityReport | null>(null);
  private violationsSubject = new BehaviorSubject<string[]>([]);

  public metrics$ = this.metricsSubject.asObservable();
  public report$ = this.reportSubject.asObservable();
  public violations$ = this.violationsSubject.asObservable();

  private readonly metrics: AccessibilityMetric[] = [];

  constructor() {
    this.initializeMonitoring();
  }

  /**
   * Initialize accessibility monitoring
   */
  private initializeMonitoring(): void {
    // Monitor page load
    window.addEventListener('load', () => {
      this.runAccessibilityAudit();
    });

    // Monitor DOM changes
    this.setupMutationObserver();

    // Monitor keyboard navigation
    this.setupKeyboardMonitoring();

    // Monitor focus management
    this.setupFocusMonitoring();

    // Monitor color contrast
    this.setupColorContrastMonitoring();
  }

  /**
   * Run comprehensive accessibility audit
   */
  async runAccessibilityAudit(): Promise<AccessibilityReport> {
    const metrics: AccessibilityMetric[] = [];

    // Check alt text coverage
    const altTextMetric = this.checkAltTextCoverage();
    metrics.push(altTextMetric);

    // Check ARIA labels
    const ariaLabelsMetric = this.checkARIALabels();
    metrics.push(ariaLabelsMetric);

    // Check heading hierarchy
    const headingMetric = this.checkHeadingHierarchy();
    metrics.push(headingMetric);

    // Check color contrast
    const contrastMetric = await this.checkColorContrast();
    metrics.push(contrastMetric);

    // Check keyboard navigation
    const keyboardMetric = this.checkKeyboardNavigation();
    metrics.push(keyboardMetric);

    // Check form accessibility
    const formMetric = this.checkFormAccessibility();
    metrics.push(formMetric);

    // Check focus management
    const focusMetric = this.checkFocusManagement();
    metrics.push(focusMetric);

    // Check semantic HTML
    const semanticMetric = this.checkSemanticHTML();
    metrics.push(semanticMetric);

    // Update metrics
    this.metricsSubject.next(metrics);
    this.metrics.push(...metrics);

    // Generate report
    const report = this.generateReport(metrics);
    this.reportSubject.next(report);

    // Send to analytics
    this.sendToAnalytics(report);

    return report;
  }

  /**
   * Check alt text coverage
   */
  private checkAltTextCoverage(): AccessibilityMetric {
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => 
      img.alt && img.alt.trim() !== '' && img.alt !== 'image'
    ).length;
    const totalImages = images.length;
    const coverage = totalImages > 0 ? (imagesWithAlt / totalImages) * 100 : 100;

    return {
      id: 'alt-text-coverage',
      name: 'Alt Text Coverage',
      value: coverage,
      threshold: 95,
      status: coverage >= 95 ? 'pass' : coverage >= 80 ? 'warning' : 'fail',
      description: `${imagesWithAlt}/${totalImages} images have proper alt text`,
      timestamp: new Date()
    };
  }

  /**
   * Check ARIA labels
   */
  private checkARIALabels(): AccessibilityMetric {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]');
    const elementsWithLabels = Array.from(interactiveElements).filter(el => {
      const hasAriaLabel = el.hasAttribute('aria-label');
      const hasAriaLabelledBy = el.hasAttribute('aria-labelledby');
      const hasTextContent = el.textContent && el.textContent.trim() !== '';
      const hasLabel = el.tagName === 'INPUT' && document.querySelector(`label[for="${el.id}"]`);
      
      return hasAriaLabel || hasAriaLabelledBy || hasTextContent || hasLabel;
    }).length;
    const totalElements = interactiveElements.length;
    const coverage = totalElements > 0 ? (elementsWithLabels / totalElements) * 100 : 100;

    return {
      id: 'aria-labels',
      name: 'ARIA Labels',
      value: coverage,
      threshold: 90,
      status: coverage >= 90 ? 'pass' : coverage >= 70 ? 'warning' : 'fail',
      description: `${elementsWithLabels}/${totalElements} interactive elements have proper labels`,
      timestamp: new Date()
    };
  }

  /**
   * Check heading hierarchy
   */
  private checkHeadingHierarchy(): AccessibilityMetric {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let violations = 0;
    let previousLevel = 0;

    Array.from(headings).forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        violations++;
      }
      previousLevel = level;
    });

    const totalHeadings = headings.length;
    const score = totalHeadings > 0 ? Math.max(0, 100 - (violations / totalHeadings) * 100) : 100;

    return {
      id: 'heading-hierarchy',
      name: 'Heading Hierarchy',
      value: score,
      threshold: 90,
      status: score >= 90 ? 'pass' : score >= 70 ? 'warning' : 'fail',
      description: `${violations} heading hierarchy violations found`,
      timestamp: new Date()
    };
  }

  /**
   * Check color contrast
   */
  private async checkColorContrast(): Promise<AccessibilityMetric> {
    // This is a simplified check - in a real implementation, you'd use a library like axe-core
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
    let contrastIssues = 0;
    let totalElements = 0;

    // Sample a subset of elements for performance
    const sampleSize = Math.min(50, textElements.length);
    const sampleElements = Array.from(textElements).slice(0, sampleSize);

    for (const element of sampleElements) {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        totalElements++;
        // Simplified contrast check - in reality, you'd calculate actual contrast ratio
        if (color === backgroundColor) {
          contrastIssues++;
        }
      }
    }

    const score = totalElements > 0 ? Math.max(0, 100 - (contrastIssues / totalElements) * 100) : 100;

    return {
      id: 'color-contrast',
      name: 'Color Contrast',
      value: score,
      threshold: 95,
      status: score >= 95 ? 'pass' : score >= 80 ? 'warning' : 'fail',
      description: `${contrastIssues} contrast issues found in ${totalElements} elements`,
      timestamp: new Date()
    };
  }

  /**
   * Check keyboard navigation
   */
  private checkKeyboardNavigation(): AccessibilityMetric {
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const elementsWithTabIndex = Array.from(focusableElements).filter(el => {
      const tabIndex = el.getAttribute('tabindex');
      return tabIndex !== null && tabIndex !== '-1';
    }).length;
    const totalElements = focusableElements.length;
    const score = totalElements > 0 ? (elementsWithTabIndex / totalElements) * 100 : 100;

    return {
      id: 'keyboard-navigation',
      name: 'Keyboard Navigation',
      value: score,
      threshold: 90,
      status: score >= 90 ? 'pass' : score >= 70 ? 'warning' : 'fail',
      description: `${elementsWithTabIndex}/${totalElements} focusable elements are keyboard accessible`,
      timestamp: new Date()
    };
  }

  /**
   * Check form accessibility
   */
  private checkFormAccessibility(): AccessibilityMetric {
    const forms = document.querySelectorAll('form');
    let accessibleForms = 0;

    Array.from(forms).forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      const labels = form.querySelectorAll('label');
      const hasLabels = inputs.length === 0 || labels.length > 0;
      
      if (hasLabels) {
        accessibleForms++;
      }
    });

    const totalForms = forms.length;
    const score = totalForms > 0 ? (accessibleForms / totalForms) * 100 : 100;

    return {
      id: 'form-accessibility',
      name: 'Form Accessibility',
      value: score,
      threshold: 90,
      status: score >= 90 ? 'pass' : score >= 70 ? 'warning' : 'fail',
      description: `${accessibleForms}/${totalForms} forms are accessible`,
      timestamp: new Date()
    };
  }

  /**
   * Check focus management
   */
  private checkFocusManagement(): AccessibilityMetric {
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const elementsWithFocusStyles = Array.from(focusableElements).filter(el => {
      const styles = window.getComputedStyle(el, ':focus');
      return styles.outline !== 'none' || styles.boxShadow !== 'none';
    }).length;
    const totalElements = focusableElements.length;
    const score = totalElements > 0 ? (elementsWithFocusStyles / totalElements) * 100 : 100;

    return {
      id: 'focus-management',
      name: 'Focus Management',
      value: score,
      threshold: 80,
      status: score >= 80 ? 'pass' : score >= 60 ? 'warning' : 'fail',
      description: `${elementsWithFocusStyles}/${totalElements} elements have visible focus indicators`,
      timestamp: new Date()
    };
  }

  /**
   * Check semantic HTML
   */
  private checkSemanticHTML(): AccessibilityMetric {
    const semanticElements = document.querySelectorAll('main, nav, header, footer, section, article, aside, h1, h2, h3, h4, h5, h6');
    const totalElements = document.querySelectorAll('div, span').length;
    const semanticRatio = totalElements > 0 ? (semanticElements.length / totalElements) * 100 : 100;

    return {
      id: 'semantic-html',
      name: 'Semantic HTML',
      value: semanticRatio,
      threshold: 30,
      status: semanticRatio >= 30 ? 'pass' : semanticRatio >= 20 ? 'warning' : 'fail',
      description: `${semanticElements.length} semantic elements found`,
      timestamp: new Date()
    };
  }

  /**
   * Generate accessibility report
   */
  private generateReport(metrics: AccessibilityMetric[]): AccessibilityReport {
    const overallScore = metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
    const recommendations = this.generateRecommendations(metrics);

    return {
      overallScore: Math.round(overallScore),
      metrics,
      recommendations,
      timestamp: new Date()
    };
  }

  /**
   * Generate recommendations based on metrics
   */
  private generateRecommendations(metrics: AccessibilityMetric[]): string[] {
    const recommendations: string[] = [];

    metrics.forEach(metric => {
      if (metric.status === 'fail') {
        switch (metric.id) {
          case 'alt-text-coverage':
            recommendations.push('Add alt text to all images for better screen reader support');
            break;
          case 'aria-labels':
            recommendations.push('Add ARIA labels to interactive elements without visible text');
            break;
          case 'heading-hierarchy':
            recommendations.push('Fix heading hierarchy to improve document structure');
            break;
          case 'color-contrast':
            recommendations.push('Improve color contrast ratios to meet WCAG standards');
            break;
          case 'keyboard-navigation':
            recommendations.push('Ensure all interactive elements are keyboard accessible');
            break;
          case 'form-accessibility':
            recommendations.push('Add proper labels to form elements');
            break;
          case 'focus-management':
            recommendations.push('Add visible focus indicators to interactive elements');
            break;
          case 'semantic-html':
            recommendations.push('Use more semantic HTML elements instead of divs and spans');
            break;
        }
      }
    });

    return recommendations;
  }

  /**
   * Setup mutation observer for DOM changes
   */
  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      let shouldAudit = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldAudit = true;
        }
      });

      if (shouldAudit) {
        // Debounce the audit
        setTimeout(() => {
          this.runAccessibilityAudit();
        }, 1000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Setup keyboard monitoring
   */
  private setupKeyboardMonitoring(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.trackKeyboardNavigation();
      }
    });
  }

  /**
   * Setup focus monitoring
   */
  private setupFocusMonitoring(): void {
    document.addEventListener('focusin', (event) => {
      this.trackFocusEvent(event.target as Element);
    });

    document.addEventListener('focusout', (event) => {
      this.trackFocusEvent(event.target as Element);
    });
  }

  /**
   * Setup color contrast monitoring
   */
  private setupColorContrastMonitoring(): void {
    // Monitor for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.runAccessibilityAudit();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /**
   * Track keyboard navigation
   */
  private trackKeyboardNavigation(): void {
    // Track keyboard navigation events
    console.log('Keyboard navigation detected');
  }

  /**
   * Track focus events
   */
  private trackFocusEvent(element: Element): void {
    // Track focus events for analytics
    console.log('Focus event:', element.tagName, element.className);
  }

  /**
   * Send metrics to analytics
   */
  private sendToAnalytics(report: AccessibilityReport): void {
    // Send to Google Analytics or other analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'accessibility_audit', {
        overall_score: report.overallScore,
        metrics_count: report.metrics.length,
        recommendations_count: report.recommendations.length
      });
    }

    // Send individual metrics
    report.metrics.forEach(metric => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'accessibility_metric', {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_status: metric.status
        });
      }
    });
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): AccessibilityMetric[] {
    return this.metricsSubject.value;
  }

  /**
   * Get current report
   */
  getCurrentReport(): AccessibilityReport | null {
    return this.reportSubject.value;
  }

  /**
   * Get violations
   */
  getViolations(): string[] {
    return this.violationsSubject.value;
  }
}
