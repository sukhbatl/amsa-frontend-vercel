import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconModule } from 'primeng/iconss';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'amsa-success',
  standalone: true,
  imports: [CommonModule, ButtonModule, IconModule, CardModule],
  template: `
    <div class="success-container" [attr.role]="role" [attr.aria-live]="ariaLive">
      <mat-card class="success-card">
        <mat-card-content>
          <div class="success-content">
            <mat-icon class="success-icon" [color]="iconColor">{{icon}}</mat-icon>
            <h3 class="success-title" *ngIf="title">{{title}}</h3>
            <p class="success-message">{{message}}</p>
            <p class="success-details" *ngIf="details">{{details}}</p>
            
            <div class="success-actions" *ngIf="showActions">
              <button 
                mat-button 
                color="primary" 
                (click)="onAction()"
                *ngIf="actionText"
                aria-label="Perform action">
                <mat-icon>{{actionIcon}}</mat-icon>
                {{actionText}}
              </button>
              
              <button 
                mat-button 
                (click)="onDismiss()"
                *ngIf="dismissible"
                aria-label="Dismiss this message">
                <mat-icon>close</mat-icon>
                Dismiss
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .success-container {
      padding: 1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .success-card {
      border-left: 4px solid var(--success-color);
      background: #e8f5e8;
    }

    .success-content {
      text-align: center;
      padding: 1rem;
    }

    .success-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
      color: var(--success-color);
    }

    .success-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--success-color);
      margin: 0 0 1rem 0;
    }

    .success-message {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      line-height: 1.5;
    }

    .success-details {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0 0 1.5rem 0;
    }

    .success-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .success-actions button {
      min-width: 120px;
    }

    .success-container[role="alert"] {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      max-width: 400px;
    }

    .success-container[role="alert"] .success-card {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .success-container {
        padding: 0.5rem;
      }
      
      .success-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .success-actions button {
        width: 100%;
        max-width: 200px;
      }
    }
  `]
})
export class SuccessComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = 'Operation completed successfully!';
  @Input() details: string = '';
  @Input() icon: string = 'check_circle';
  @Input() iconColor: string = 'primary';
  @Input() showActions: boolean = true;
  @Input() dismissible: boolean = true;
  @Input() actionText: string = '';
  @Input() actionIcon: string = 'arrow_forward';
  @Input() role: 'alert' | 'status' = 'status';
  @Input() ariaLive: 'polite' | 'assertive' | 'off' = 'polite';

  @Output() action = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  ngOnInit(): void {
    // Ensure proper accessibility
    if (this.role === 'alert') {
      this.ariaLive = 'assertive';
    } else if (this.role === 'status') {
      this.ariaLive = 'polite';
    }
  }

  onAction(): void {
    this.action.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
