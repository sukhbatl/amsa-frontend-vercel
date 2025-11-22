import { Component, OnInit } from '@angular/core';
import {BadgesService} from '../badges.service';
import {BadgeUsersModel} from '../badges.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-badge-users',
    templateUrl: './badge-users.component.html',
    imports: [
        CommonModule,
        ProgressSpinnerModule,
        CardModule,
    ]
})
export class BadgeUsersComponent implements OnInit {
  badgeUsers: BadgeUsersModel | undefined;
  isLoading = false;
  backendUrl = environment.backendUrl;

  constructor(
    private badgesService: BadgesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        const id = paramMap.get('id');
        this.badgesService.getAllUsers(id!).then(res => {
          this.badgeUsers = res;
          this.isLoading = false;
        }).catch(e => {
          console.log(e);
          this.isLoading = false;
        })
      }
    });
  }

  navigateToProfile(userId: number) {
    this.router.navigate(['/profile', 'user', userId]);
  }

}
