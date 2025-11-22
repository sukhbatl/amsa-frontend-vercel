import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LanguageService } from './language.service';
import { ENGLISH_TRANSLATION, MONGOLIAN_TRANSLATION } from './language.service';
import { takeUntil } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TitleService implements OnDestroy {
  private _title: BehaviorSubject<string> = new BehaviorSubject<string>('');
  title = this._title.asObservable();
  destroy$ = new Subject();

  constructor(
    private pageTitleService: Title,
    @Inject(LanguageService) private languageService: LanguageService,
  ) { }

  setTitle(title: string) {
    this.languageService.currentLanguage.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      if (lang === 'mongolian') {
        let translationKey;
        for (let [key, value] of Object.entries(ENGLISH_TRANSLATION)) {
          if (value === title) {
            translationKey = key;
            break;
          }
        }
        if (translationKey) {
        //   this._title.next(MONGOLIAN_TRANSLATION[translationKey]);
        //   this.pageTitleService.setTitle('AMSA - Association of Mongolian Students in America - ' + MONGOLIAN_TRANSLATION[translationKey]);
          return;
        }
      }

      this._title.next(title);
      this.pageTitleService.setTitle('AMSA - Association of Mongolian Students in America - ' + title);
    });
  }

  ngOnDestroy() {
    // this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}