import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private isMobile = new Subject();
  public screenWidth!: string;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
    this.checkWidth();
  }

  onMobileChange(status: boolean) {
    this.isMobile.next(status);
  }

  getMobileStatus(): Observable<any> {
    return this.isMobile.asObservable();
  }

  public checkWidth() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      if (width <= 768) {
        this.screenWidth = 'sm';
        this.onMobileChange(true);
      } else if (width > 768 && width <= 992) {
        this.screenWidth = 'md';
        this.onMobileChange(false);
      } else {
        this.screenWidth = 'lg';
        this.onMobileChange(false);
      }
    }
  }
}
