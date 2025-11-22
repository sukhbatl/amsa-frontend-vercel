import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { log } from 'console';

interface ForgotPasswordModel {
    email: FormControl<string>;
}

@Component({
  selector: 'app-forgot',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  templateUrl: './forgot.component.html',
})
export class ForgotComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  isLoading = false;
  resetForm: FormGroup<ForgotPasswordModel> = this.fb.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  });

  forgotPassword() {
    const { email } = this.resetForm.getRawValue();
    this.isLoading = true;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        console.log('sent an email!');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Please check your email!',
          life: 5000
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('error during forgotPass: ', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Email not found!',
          life: 5000
        });
        this.isLoading = false;
      }
    });
  }
}
