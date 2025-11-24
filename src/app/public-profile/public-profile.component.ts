import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { ProfileModel } from '../profile/profile.model';
import { environment } from '../../environments/environment';
import { TitleService } from '../services/title.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  imports: [CommonModule, ProgressSpinnerModule, CardModule, ButtonModule, RouterLink],
})
export class PublicProfileComponent implements OnInit {
  isLoading = false;
  profile: ProfileModel | undefined;
  backendUrl = environment.backendUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private titleService: TitleService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('Member Profile');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('identifier')) {
        let identifier = paramMap.get('identifier');

        // Map username to user ID for specific users
        const usernameToIdMap: { [key: string]: string } = {
          sukhbatlkhagvadorj: '35',
        };

        // If identifier is a known username, convert it to ID
        if (identifier && usernameToIdMap[identifier.toLowerCase()]) {
          identifier = usernameToIdMap[identifier.toLowerCase()];
        }

        this.profileService
          .getPublicUserProfile(identifier)
          .then(res => {
            this.profile = res;
            this.titleService.setTitle(`${res.firstName} ${res.lastName} - AMSA`);
            this.isLoading = false;
          })
          .catch(e => {
            console.log(e);
            this.isLoading = false;
          });
      }
    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/AMSA_logo_1024.png';
  }

  onBadgeClick(badgeId: number) {
    if (this.authService.getIsAuth()) {
      this.router.navigate(['/badges', badgeId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return '';
    }
    // If it's already a full URL (starts with http/https), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, prepend the backend URL
    return this.backendUrl + imagePath;
  }
}
