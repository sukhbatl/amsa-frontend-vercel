import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TitleService } from '../../services/title.service';
import { LanguageService } from '../../../app/services/language.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [
    CommonModule,
    InputTextModule,
    FloatLabel,
    FormsModule
  ]
})
export class SignupComponent implements OnInit {
  translationText$: Observable<any>;
  memberValue = '';

  constructor(
    private languageService: LanguageService,
    private titleService: TitleService,
    private router: Router
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
  }

  ngOnInit(): void {
    this.titleService.setTitle('AMSA Registration');
  }

  navigateToMember(): void {
    this.router.navigate(['/signup/member']);
  }
}
