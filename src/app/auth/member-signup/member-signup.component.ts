import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { TitleService } from '../../services/title.service';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { patternValidator } from '../../../validators/pattern.validator';
import { AuthRegisterModel } from '../auth-data.model';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../app/services/language.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-member-signup',
  templateUrl: './member-signup.component.html',
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
  ]
})
export class MemberSignupComponent implements OnInit {
  isLoading = false;
  accountInfo = this.fb.group({
    email: ['', [Validators.required, Validators.email, patternValidator(/.edu$/)]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });
  translationText$: Observable<any>;

  constructor(
    private fb: UntypedFormBuilder,
    private titleService: TitleService,
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

  submitForm() {
    const a_info = this.accountInfo.value;
    this.isLoading = true;
    const user: Partial<AuthRegisterModel> = {
      email: a_info['email'],
      password: a_info['password'],
    };

    this.authService.createUser(user as AuthRegisterModel).then((res) => {
      this.isLoading = false;
      console.log(res.message);
      if (res.message === 'User created!') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Та амжилттай бүртгүүлсэн!', life: 5000 });
        // this.router.navigate(['/auth/verify/' + a_info['email']]);
      }
      console.log(res.message);

    }).catch((err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 5000 });
      console.log(err.message);
      this.authService.setAuthListener(false);
      this.authService.setLevelListener(0);
      this.isLoading = false;
    });
  }

}

