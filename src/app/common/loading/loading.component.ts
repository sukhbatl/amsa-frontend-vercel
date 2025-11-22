import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconModule } from 'primeng/iconss';

@Component({
  selector: 'amsa-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, IconModule],
  template: `
    <div class="loading-container" [attr.aria-live]="ariaLive" [attr.aria-label]="ariaLabel">
      <div class="loading-content">
        <mat-spinner 
          [diameter]="size" 
          [color]="color"
          [attr.aria-label]="loadingText">
        </mat-spinner>
        <p class="loading-text" *ngIf="showText">{{loadingText}}</p>
        <p class="loading-subtext" *ngIf="subText">{{subText}}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: 200px;
    }

    .loading-content {
      text-align: center;
    }

    .loading-text {
      margin-top: 1rem;
      font-size: 1.1rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .loading-subtext {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .loading-container[aria-live="polite"] {
      position: relative;
    }

    .loading-container[aria-live="assertive"] {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-overlay);
      z-index: 1000;
    }
  `]
})
export class LoadingComponent implements OnInit {
  @Input() size: number = 50;
  @Input() color: string = 'primary';
  @Input() loadingText: string = 'Loading...';
  @Input() subText: string = '';
  @Input() showText: boolean = true;
  @Input() ariaLive: 'polite' | 'assertive' | 'off' = 'polite';
  @Input() ariaLabel: string = 'Loading content';

  ngOnInit(): void {
    // Ensure proper accessibility
    if (!this.ariaLabel) {
      this.ariaLabel = this.loadingText;
    }
  }
}
