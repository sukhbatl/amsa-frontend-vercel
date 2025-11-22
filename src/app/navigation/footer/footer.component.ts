import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../app/services/language.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import packageJson from '../../../../package.json';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    imports: [
        CommonModule,
        FontAwesomeModule,
    ]
})
export class FooterComponent implements OnInit {
  translationText$: Observable<any>;
  appVersion: string = packageJson.version;

  constructor(
    private languageService: LanguageService,
  ) { 
    this.translationText$ = this.languageService.currentTranslationText;
   }

  ngOnInit() {
  }

}
