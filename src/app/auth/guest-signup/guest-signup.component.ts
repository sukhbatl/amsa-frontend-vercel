import { Component, OnInit } from '@angular/core';
import {TitleService} from '../../services/title.service';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {patternValidator} from '../../../validators/pattern.validator';
import {AuthGuestRegisterModel, AuthRegisterModel} from '../auth-data.model';
import {AuthService} from '../auth.service';
import { MessageService } from 'primeng/api';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-guest-signup',
    templateUrl: './guest-signup.component.html',
    imports: [
        StepperModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        CommonModule,
        DatePickerModule,
        ButtonModule
    ]
})
export class GuestSignupComponent implements OnInit {
  currentStep = 0;
  isLoading = false;
  accountInfo = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
  });
  personalInfo = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required]],
  });
  translationText$: Observable<any>;
  
  constructor(
    private titleService: TitleService,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private languageService: LanguageService,
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
   }

  ngOnInit() {
    this.titleService.setTitle('AMSA Registration - Member');
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }

  submitForm() {
    const a_info = this.accountInfo.value;
    const p_info = this.personalInfo.value;
    this.isLoading = true;
    const user: AuthGuestRegisterModel = {
      email: a_info['email'],
      password: a_info['password'],
      firstName: p_info['firstname'],
      lastName: p_info['lastname'],
      birthday: p_info['birthDate'],
    };

    this.authService.createGuestUser(user).then((res) => {
      this.isLoading = false;
      if (res['message'] === 'User created!') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Та амжилттай бүртгүүлсэн!', life: 5000 });
        this.router.navigate(['/auth/verify/' + a_info['email']]);
      }

    }).catch(() => {
      this.authService.setAuthListener(false);
      this.authService.setLevelListener(0);
      this.isLoading = false;
    });
  }

}
