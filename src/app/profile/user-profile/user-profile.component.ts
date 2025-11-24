import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { ProfileService } from '../profile.service';
import { ProfileModel } from '../profile.model';
import { environment } from '../../../environments/environment';
import { TitleService } from '../../services/title.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ListboxModule } from 'primeng/listbox';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { InteractionService } from '../../services/interaction.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    CardModule,
    AccordionModule,
    ListboxModule,
    RouterLink,
    ConfirmDialogModule,
    ButtonModule,
  ],
})
export class UserProfileComponent implements OnInit {
  isLoading = false;
  profile: ProfileModel | undefined;
  backendUrl = environment.backendUrl;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private titleService: TitleService,
    private confirmationService: ConfirmationService,
    private interactionService: InteractionService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('Profile');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.profileService
          .getUserProfile(id)
          .then(res => {
            this.profile = res;
            this.isLoading = false;
          })
          .catch(e => {
            console.log(e);
            this.isLoading = false;
          });
      }
    });
  }

  likeOrDislikePost(id: number) {
    this.interactionService
      .likeOrDislikePost(id)
      .then(res => {
        this.confirmationService.confirm({
          message: 'Action taken!',
          header: 'Success',
          icon: 'pi pi-check',
          rejectButtonStyleClass: 'p-button-text',
          accept: () => {},
        });
      })
      .catch(err => {
        console.log(err);
      });
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
