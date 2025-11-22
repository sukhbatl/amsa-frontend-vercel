import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {TitleService} from '../../services/title.service';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';
import { MessageService } from 'primeng/api';
import { LanguageService } from '../../../../src/app/services/language.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        CommonModule,
        CardModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        RouterLink,
    ]
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
      ]
    ],
    password: ['', [
      Validators.required,
      Validators.minLength(2)
      ]
    ]
  });;
  isLoading = false;
  translationText$: Observable<any>;
  constructor(
    private fb: UntypedFormBuilder,
    private titleService: TitleService,
    private authService: AuthService,
    private messageService: MessageService,
    private languageService: LanguageService,
    private router: Router,
  ) {
    this.translationText$ = this.languageService.currentTranslationText;
   }

  ngOnInit() {
    this.titleService.setTitle('Login');
    this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
        if (authStatus) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Та амжилттай нэвтрэн орлоо', life: 5000 });
        }
      }
    );
  }

  onSubmit(): void {
    const email = this.loginForm.value['email'];
    const password = this.loginForm.value['password'];
    this.isLoading = true;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful!', life: 5000 });
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message ?? 'Login failed. Please try again.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, life: 5000 });
      },
    });
  }

  getEmailErrorMessage() {
    return this.email?.hasError('required') ? 'You must enter a value' :
      this.email?.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    return this.password?.hasError('required') ? 'You must enter a value' :
      this.password?.hasError('minlength') ? 'Minimum of 2 characters' : '';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
