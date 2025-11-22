import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {TitleService} from '../../services/title.service';
import { LanguageService } from '../../../app/services/language.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    imports: [
        CommonModule,
        RouterLink
    ]
})
export class SignupComponent implements OnInit {
  translationText$: Observable<any>;
  constructor(
    private languageService: LanguageService,
    private titleService: TitleService
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
  }

  ngOnInit(): void {
    this.titleService.setTitle('AMSA Registration');
  }
}
