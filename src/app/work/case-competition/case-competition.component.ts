import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../app/services/language.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-join',
    templateUrl: './case-competition.component.html',
    imports: [
        CommonModule
    ]
})
export class CaseCompetitionComponent implements OnInit {
  translationText$: Observable<any>;

  constructor(
    private titleService: TitleService,
    private languageService: LanguageService,
  ) { 
    this.translationText$ = this.languageService.currentTranslationText;
  }

  ngOnInit() {
    this.titleService.setTitle('ACT Career Training Program');
  }

}