import { Component, NgModule, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TitleService } from '../services/title.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { LanguageService } from '../services/language.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserCardComponent } from '../common/user-card/user-card.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HomeModel } from '../home/home.model';
import { HomeService } from '../home/home.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    imports: [
        CommonModule,
        ButtonModule,
        ProgressSpinnerModule,
        UserCardComponent,
        InputTextModule,
        RouterLink,
        FontAwesomeModule,
    ]
})
export class LandingComponent implements OnInit {
    homeData?: HomeModel;
    backendUrl = environment.backendUrl;
    isLoading = false;
    translationText$: Observable<any>;
    constructor(
        private titleService: TitleService,
        private router: Router,
        private homeService: HomeService,
        private languageService: LanguageService,
    ) { 
        this.translationText$ = this.languageService.currentTranslationText;
    }

    logos: string[] = [
        'assets/logos/brown.png',
        'assets/logos/columbia.png',
        'assets/logos/harvard.png',
        'assets/logos/johnshopkins.png',
        'assets/logos/mit.png',
        'assets/logos/mountholyoke.png',
        'assets/logos/nyu.png',
        'assets/logos/stanford.png',
        'assets/logos/vanderbilt.png',
        'assets/logos/wesleyan.png',
    ];

    duration = 20;

    ngOnInit() {
        this.isLoading = true;
        this.titleService.setTitle('Landing');
        this.homeService.getHomeInfo().then(res => {
            this.homeData = res;
            this.isLoading = false;
        }).catch(() => {
            this.isLoading = false;
        });
        }
}