import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'amsa-user-card',
    templateUrl: './user-card.component.html',
    imports: [
        CommonModule,
        CardModule,
        RouterModule,
    ]
})

export class UserCardComponent implements OnInit, OnDestroy {
  @Input() name: string = "";
  @Input() userId: number = 0;
  @Input() email: string = "";
  @Input() schoolName: string = "";
  @Input() profilePic: string = "";
  @Input() position: string = "";
  @Input() content: string = "";
  @Input() minHeight: string = "";
  userIsAuthenticated = false;
  private authStateListenerSubs?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authStateListenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  this.userIsAuthenticated = this.authService.getIsAuth();
  }

  ngOnDestroy() {
    this.authStateListenerSubs?.unsubscribe();
  }

  navigateToProfile() {
    // Map user ID to username for specific users
    const idToUsernameMap: { [key: number]: string } = {
      35: 'sukhbatlkhagvadorj'
    };
    
    const identifier = idToUsernameMap[this.userId] || this.userId;
    
    if (this.userIsAuthenticated) {
      this.router.navigate(['/profile', 'user', this.userId]);
    } else {
      this.router.navigate(['/public-profile', 'user', identifier]);
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/AMSA_logo_1024.png';
  }

}
