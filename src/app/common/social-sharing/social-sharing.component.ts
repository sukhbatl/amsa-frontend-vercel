import { Component, Input, OnInit } from '@angular/core';
import { SocialSharingService, ShareData } from '../../services/social-sharing.service';

@Component({
  selector: 'app-social-sharing',
  template: `
    <div class="social-sharing-container" role="group" aria-label="Share this content">
      <h3 class="sr-only">Share this content</h3>
      
      <!-- Native share button (if supported) -->
      <button 
        *ngIf="showNativeShare" 
        mat-icon-button 
        (click)="shareNative()"
        aria-label="Share using native sharing"
        class="share-button native-share">
        <mat-icon>share</mat-icon>
      </button>

      <!-- Social media buttons -->
      <div class="social-buttons" *ngIf="!showNativeShare">
        <button 
          mat-icon-button 
          (click)="shareFacebook()"
          aria-label="Share on Facebook"
          class="share-button facebook">
          <mat-icon svgIcon="facebook"></mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="shareTwitter()"
          aria-label="Share on Twitter"
          class="share-button twitter">
          <mat-icon svgIcon="twitter"></mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="shareLinkedIn()"
          aria-label="Share on LinkedIn"
          class="share-button linkedin">
          <mat-icon svgIcon="linkedin"></mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="shareWhatsApp()"
          aria-label="Share on WhatsApp"
          class="share-button whatsapp">
          <mat-icon svgIcon="whatsapp"></mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="shareEmail()"
          aria-label="Share via email"
          class="share-button email">
          <mat-icon>email</mat-icon>
        </button>

        <button 
          mat-icon-button 
          (click)="copyLink()"
          aria-label="Copy link to clipboard"
          class="share-button copy">
          <mat-icon>link</mat-icon>
        </button>
      </div>

      <!-- Success message -->
      <div *ngIf="showSuccessMessage" class="success-message" role="alert" aria-live="polite">
        Link copied to clipboard!
      </div>
    </div>
  `,
  styles: [`
    .social-sharing-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--bg-elevated, #f5f5f5);
      border-radius: var(--border-radius, 8px);
      margin: 16px 0;
    }

    .social-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .share-button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .share-button:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .share-button:focus {
      outline: 3px solid var(--primary-color, #d84315);
      outline-offset: 2px;
    }

    .native-share {
      background: var(--primary-color, #d84315);
      color: white;
    }

    .facebook {
      background: #1877f2;
      color: white;
    }

    .twitter {
      background: #1da1f2;
      color: white;
    }

    .linkedin {
      background: #0077b5;
      color: white;
    }

    .whatsapp {
      background: #25d366;
      color: white;
    }

    .email {
      background: #ea4335;
      color: white;
    }

    .copy {
      background: #6c757d;
      color: white;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      animation: fadeInOut 3s ease-in-out;
    }

    @keyframes fadeInOut {
      0%, 100% { opacity: 0; }
      20%, 80% { opacity: 1; }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 768px) {
      .social-buttons {
        gap: 12px;
      }
      
      .share-button {
        width: 56px;
        height: 56px;
      }
    }
  `]
})
export class SocialSharingComponent implements OnInit {
  @Input() shareData: ShareData = {
    title: 'AMSA - Association of Mongolian Students in America',
    text: 'Connecting over 600 Mongolian students pursuing higher education in the US.',
    url: 'https://amsa.org'
  };

  showNativeShare = false;
  showSuccessMessage = false;

  constructor(private socialSharingService: SocialSharingService) {}

  ngOnInit(): void {
    // Check if native sharing is supported
    this.showNativeShare = 'share' in navigator;
  }

  async shareNative(): Promise<void> {
    const success = await this.socialSharingService.shareNative(this.shareData);
    if (!success) {
      // Fallback to other sharing methods
      this.shareFacebook();
    }
  }

  shareFacebook(): void {
    this.socialSharingService.shareFacebook(this.shareData);
  }

  shareTwitter(): void {
    this.socialSharingService.shareTwitter(this.shareData);
  }

  shareLinkedIn(): void {
    this.socialSharingService.shareLinkedIn(this.shareData);
  }

  shareWhatsApp(): void {
    this.socialSharingService.shareWhatsApp(this.shareData);
  }

  shareEmail(): void {
    this.socialSharingService.shareEmail(this.shareData);
  }

  async copyLink(): Promise<void> {
    const success = await this.socialSharingService.copyLink(this.shareData);
    if (success) {
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  }
}
