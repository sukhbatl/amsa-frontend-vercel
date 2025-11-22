import { Component, NgModule, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TitleService } from '../services/title.service';
import { Router } from '@angular/router';
import { HomeModel } from './home.model';
import { HomeService } from './home.service';
import { environment } from '../../environments/environment';
import { LanguageService } from '../services/language.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserCardComponent } from '../common/user-card/user-card.component';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    UserCardComponent,
    InputTextModule,
  ]
})
export class HomeComponent implements OnInit {
  imageUrls: Array<object> = [
    { image: 'assets/slideshow/AGM_2012.jpg', thumbImage: 'assets/slideshow/AGM_2012.jpg', title: 'AGM 2012 - Cambridge, MA' },
    { image: 'assets/slideshow/AGM_2013.jpg', thumbImage: 'assets/slideshow/AGM_2013.jpg', title: 'AGM 2013 - Cambridge, MA' },
    { image: 'assets/slideshow/AGM_2014.jpg', thumbImage: 'assets/slideshow/AGM_2014.jpg', title: 'AGM 2014 - New York, NY' },
    { image: 'assets/slideshow/AGM_2015.jpg', thumbImage: 'assets/slideshow/AGM_2015.jpg', title: 'AGM 2015 - Ann Arbor, MI' },
    { image: 'assets/slideshow/AGM_2016.jpg', thumbImage: 'assets/slideshow/AGM_2016.jpg', title: 'AGM 2016 - Atlanta, GA' },
    { image: 'assets/slideshow/AGM_2017.jpg', thumbImage: 'assets/slideshow/AGM_2017.jpg', title: 'AGM 2017 - Chicago, IL' },
    { image: 'assets/slideshow/AGM_2018.jpg', thumbImage: 'assets/slideshow/AGM_2018.jpg', title: 'AGM 2018 - New York, NY' },
    { image: 'assets/slideshow/AGM_2019.jpg', thumbImage: 'assets/slideshow/AGM_2019.jpg', title: 'AGM 2019 - Boulder, CO' },
  ];

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

  ngOnInit() {
    this.isLoading = true;
    this.titleService.setTitle('Home');
    this.homeService.getHomeInfo().then(res => {
      this.homeData = res;
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

  navigate(year: string) {
    this.router.navigate(['agm/' + year])
  }
}