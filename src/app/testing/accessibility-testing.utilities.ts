import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export interface AccessibilityTestResult {
  test: string;
  passed: boolean;
  message: string;
  element?: string;
  severity: 'error' | 'warning' | 'info';
}

export class AccessibilityTestingUtilities {
  /**
   * Test if all images have alt text
   */
  static testAltText(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const images = fixture.debugElement.queryAll(By.css('img'));

    images.forEach((img, index) => {
      const alt = img.nativeElement.getAttribute('alt');
      const src = img.nativeElement.getAttribute('src');

      if (!alt || alt.trim() === '') {
        results.push({
          test: 'alt-text',
          passed: false,
          message: `Image ${index + 1} is missing alt text`,
          element: `img[src="${src}"]`,
          severity: 'error'
        });
      } else if (alt === 'image' || alt === 'picture') {
        results.push({
          test: 'alt-text',
          passed: false,
          message: `Image ${index + 1} has generic alt text: "${alt}"`,
          element: `img[src="${src}"]`,
          severity: 'warning'
        });
      } else {
        results.push({
          test: 'alt-text',
          passed: true,
          message: `Image ${index + 1} has proper alt text: "${alt}"`,
          element: `img[src="${src}"]`,
          severity: 'info'
        });
      }
    });

    return results;
  }

  /**
   * Test if all buttons have accessible labels
   */
  static testButtonLabels(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    buttons.forEach((button, index) => {
      const element = button.nativeElement;
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      const textContent = element.textContent?.trim();
      const title = element.getAttribute('title');

      const hasAccessibleLabel = ariaLabel || ariaLabelledBy || textContent || title;

      if (!hasAccessibleLabel) {
        results.push({
          test: 'button-labels',
          passed: false,
          message: `Button ${index + 1} is missing accessible label`,
          element: `button[${element.className}]`,
          severity: 'error'
        });
      } else {
        results.push({
          test: 'button-labels',
          passed: true,
          message: `Button ${index + 1} has accessible label`,
          element: `button[${element.className}]`,
          severity: 'info'
        });
      }
    });

    return results;
  }

  /**
   * Test heading hierarchy
   */
  static testHeadingHierarchy(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const headings = fixture.debugElement.queryAll(By.css('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    let hasH1 = false;

    headings.forEach((heading, index) => {
      const element = heading.nativeElement;
      const level = parseInt(element.tagName.charAt(1));
      const text = element.textContent?.trim();

      // Check for H1
      if (level === 1) {
        hasH1 = true;
      }

      // Check hierarchy
      if (level > previousLevel + 1) {
        results.push({
          test: 'heading-hierarchy',
          passed: false,
          message: `Heading ${element.tagName} (${text}) skips level ${previousLevel + 1}`,
          element: `${element.tagName.toLowerCase()}[${index}]`,
          severity: 'error'
        });
      } else {
        results.push({
          test: 'heading-hierarchy',
          passed: true,
          message: `Heading ${element.tagName} (${text}) follows proper hierarchy`,
          element: `${element.tagName.toLowerCase()}[${index}]`,
          severity: 'info'
        });
      }

      previousLevel = level;
    });

    // Check for H1
    if (!hasH1) {
      results.push({
        test: 'heading-hierarchy',
        passed: false,
        message: 'Page is missing H1 heading',
        element: 'page',
        severity: 'error'
      });
    }

    return results;
  }

  /**
   * Test form accessibility
   */
  static testFormAccessibility(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const forms = fixture.debugElement.queryAll(By.css('form'));

    forms.forEach((form, formIndex) => {
      const formElement = form.nativeElement;
      const inputs = form.queryAll(By.css('input, select, textarea'));

      inputs.forEach((input, inputIndex) => {
        const inputElement = input.nativeElement;
        const id = inputElement.getAttribute('id');
        const type = inputElement.getAttribute('type');
        const ariaLabel = inputElement.getAttribute('aria-label');
        const ariaLabelledBy = inputElement.getAttribute('aria-labelledby');
        const placeholder = inputElement.getAttribute('placeholder');

        // Check for label
        const label = form.query(By.css(`label[for="${id}"]`));
        const hasLabel = !!label;
        const hasAriaLabel = ariaLabel || ariaLabelledBy;
        const hasPlaceholder = placeholder && placeholder.trim() !== '';

        if (!hasLabel && !hasAriaLabel && !hasPlaceholder) {
          results.push({
            test: 'form-accessibility',
            passed: false,
            message: `Form ${formIndex + 1}, Input ${inputIndex + 1} (${type}) is missing label`,
            element: `input[type="${type}"][${inputIndex}]`,
            severity: 'error'
          });
        } else {
          results.push({
            test: 'form-accessibility',
            passed: true,
            message: `Form ${formIndex + 1}, Input ${inputIndex + 1} (${type}) has proper labeling`,
            element: `input[type="${type}"][${inputIndex}]`,
            severity: 'info'
          });
        }
      });
    });

    return results;
  }

  /**
   * Test keyboard navigation
   */
  static testKeyboardNavigation(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const focusableElements = fixture.debugElement.queryAll(By.css('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'));

    focusableElements.forEach((element, index) => {
      const nativeElement = element.nativeElement;
      const tagName = nativeElement.tagName.toLowerCase();
      const tabIndex = nativeElement.getAttribute('tabindex');

      // Check if element is focusable
      if (tabIndex === '-1') {
        results.push({
          test: 'keyboard-navigation',
          passed: false,
          message: `Element ${tagName} ${index + 1} has tabindex="-1" and is not keyboard accessible`,
          element: `${tagName}[${index}]`,
          severity: 'warning'
        });
      } else {
        results.push({
          test: 'keyboard-navigation',
          passed: true,
          message: `Element ${tagName} ${index + 1} is keyboard accessible`,
          element: `${tagName}[${index}]`,
          severity: 'info'
        });
      }
    });

    return results;
  }

  /**
   * Test color contrast (simplified)
   */
  static testColorContrast(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const textElements = fixture.debugElement.queryAll(By.css('p, span, div, h1, h2, h3, h4, h5, h6, a, button'));

    // This is a simplified test - in a real implementation, you'd use a library like axe-core
    textElements.forEach((element, index) => {
      const nativeElement = element.nativeElement;
      const styles = window.getComputedStyle(nativeElement);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // Simplified check - in reality, you'd calculate actual contrast ratio
        if (color === backgroundColor) {
          results.push({
            test: 'color-contrast',
            passed: false,
            message: `Element ${index + 1} has identical text and background colors`,
            element: `${nativeElement.tagName.toLowerCase()}[${index}]`,
            severity: 'error'
          });
        } else {
          results.push({
            test: 'color-contrast',
            passed: true,
            message: `Element ${index + 1} has different text and background colors`,
            element: `${nativeElement.tagName.toLowerCase()}[${index}]`,
            severity: 'info'
          });
        }
      }
    });

    return results;
  }

  /**
   * Test semantic HTML usage
   */
  static testSemanticHTML(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];
    const semanticElements = fixture.debugElement.queryAll(By.css('main, nav, header, footer, section, article, aside, h1, h2, h3, h4, h5, h6'));
    const divElements = fixture.debugElement.queryAll(By.css('div'));
    const spanElements = fixture.debugElement.queryAll(By.css('span'));

    const semanticCount = semanticElements.length;
    const totalElements = divElements.length + spanElements.length;

    if (totalElements > 0) {
      const semanticRatio = (semanticCount / totalElements) * 100;

      if (semanticRatio < 20) {
        results.push({
          test: 'semantic-html',
          passed: false,
          message: `Low semantic HTML usage: ${semanticRatio.toFixed(1)}%`,
          element: 'page',
          severity: 'warning'
        });
      } else {
        results.push({
          test: 'semantic-html',
          passed: true,
          message: `Good semantic HTML usage: ${semanticRatio.toFixed(1)}%`,
          element: 'page',
          severity: 'info'
        });
      }
    }

    return results;
  }

  /**
   * Run all accessibility tests
   */
  static runAllTests(fixture: ComponentFixture<any>): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = [];

    results.push(...this.testAltText(fixture));
    results.push(...this.testButtonLabels(fixture));
    results.push(...this.testHeadingHierarchy(fixture));
    results.push(...this.testFormAccessibility(fixture));
    results.push(...this.testKeyboardNavigation(fixture));
    results.push(...this.testColorContrast(fixture));
    results.push(...this.testSemanticHTML(fixture));

    return results;
  }

  /**
   * Generate accessibility report
   */
  static generateReport(results: AccessibilityTestResult[]): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    warningTests: number;
    score: number;
    errors: AccessibilityTestResult[];
    warnings: AccessibilityTestResult[];
  } {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed && r.severity === 'error').length;
    const warningTests = results.filter(r => !r.passed && r.severity === 'warning').length;
    const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;

    return {
      totalTests,
      passedTests,
      failedTests,
      warningTests,
      score,
      errors: results.filter(r => !r.passed && r.severity === 'error'),
      warnings: results.filter(r => !r.passed && r.severity === 'warning')
    };
  }

  /**
   * Print accessibility report to console
   */
  static printReport(results: AccessibilityTestResult[]): void {
    const report = this.generateReport(results);
    
    console.group('🔍 Accessibility Test Report');
    console.log(`📊 Overall Score: ${report.score}%`);
    console.log(`✅ Passed: ${report.passedTests}/${report.totalTests}`);
    console.log(`❌ Failed: ${report.failedTests}`);
    console.log(`⚠️  Warnings: ${report.warningTests}`);
    
    if (report.errors.length > 0) {
      console.group('❌ Errors');
      report.errors.forEach(error => {
        console.error(`${error.test}: ${error.message}`, error.element);
      });
      console.groupEnd();
    }
    
    if (report.warnings.length > 0) {
      console.group('⚠️  Warnings');
      report.warnings.forEach(warning => {
        console.warn(`${warning.test}: ${warning.message}`, warning.element);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}
