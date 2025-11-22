import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'amsa-error',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  template: `
    <div class="p-4 max-w-2xl mx-auto" [attr.role]="role" [attr.aria-live]="ariaLive">
      <p-card class="border-l-4 border-red-600 bg-red-50">
        <div class="text-center p-4">
          <i [class]="icon" class="text-5xl mb-4 text-red-600"></i>
          <h3 *ngIf="title" class="text-2xl font-semibold text-red-600 mb-4">{{title}}</h3>
          <p class="text-lg text-gray-800 mb-2 leading-relaxed">{{message}}</p>
          <p *ngIf="details" class="text-sm text-gray-600 mb-6 font-mono bg-black bg-opacity-5 p-2 rounded break-words">{{details}}</p>
          
          <div *ngIf="showActions" class="flex gap-4 justify-center flex-wrap">
            <p-button 
              label="{{isRetrying ? 'Retrying...' : 'Try Again'}}"
              icon="pi pi-refresh"
              [disabled]="isRetrying"
              (onClick)="onRetry()"
              aria-label="Retry the operation"
              severity="secondary">
            </p-button>
            
            <p-button 
              *ngIf="dismissible"
              label="Dismiss"
              icon="pi pi-times"
              (onClick)="onDismiss()"
              aria-label="Dismiss this error"
              severity="secondary"
              [outlined]="true">
            </p-button>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: []
})
export class ErrorComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = 'An error occurred. Please try again.';
  @Input() details: string = '';
  @Input() icon: string = 'error';
  @Input() iconColor: string = 'warn';
  @Input() showActions: boolean = true;
  @Input() dismissible: boolean = true;
  @Input() role: 'alert' | 'status' = 'alert';
  @Input() ariaLive: 'polite' | 'assertive' | 'off' = 'assertive';
  @Input() isRetrying: boolean = false;

  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  ngOnInit(): void {
    // Ensure proper accessibility
    if (this.role === 'alert') {
      this.ariaLive = 'assertive';
    } else if (this.role === 'status') {
      this.ariaLive = 'polite';
    }
  }

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
