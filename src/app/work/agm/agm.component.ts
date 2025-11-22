import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../app/services/language.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    imports: [
        CommonModule
    ]
})
export class AgmComponent implements OnInit {

  translationText$: Observable<any>;

  constructor(
    private titleService: TitleService,
    private languageService: LanguageService
  ) { 
    this.translationText$ = this.languageService.currentTranslationText;
  }

  ngOnInit() {
    this.titleService.setTitle('AGM');
  }

}
