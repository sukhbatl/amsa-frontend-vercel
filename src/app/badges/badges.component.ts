import { Component, OnInit } from '@angular/core';
import {BadgesService} from './badges.service';
import {BadgeModel} from './badges.model';
import {environment} from '../../environments/environment';
import {TitleService} from '../services/title.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-badges',
    templateUrl: './badges.component.html',
    imports: [
        ProgressSpinnerModule,
        CardModule,
        CommonModule,
    ]
})

export class BadgesComponent implements OnInit {
  isLoading = false;
  badges: BadgeModel[] = [];
  backendUrl = environment.backendUrl;
  constructor(
    private titleService: TitleService,
    private badgesService: BadgesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.titleService.setTitle('List of All Badges');
    this.isLoading = true;
    this.badgesService.getAllBadges().then(res => {
      this.badges = res;
      this.isLoading = false;
    }).catch(() => {
        this.isLoading = false;
      }
    );
  }

  navigateToBadge(id: number) {
    this.router.navigate(['badges', id]);
  }

}
