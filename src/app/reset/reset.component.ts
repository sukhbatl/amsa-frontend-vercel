import {Component, inject} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ConfirmationService} from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface ResetPasswordModel {
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-reset',
    standalone: true,
    imports: [InputTextModule, ButtonModule, CardModule, ReactiveFormsModule, RouterModule, ConfirmPopupModule, ConfirmDialogModule],
    templateUrl: './reset.component.html',
})
export class ResetComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    form: FormGroup<ResetPasswordModel> = this.fb.group({
        password: this.fb.nonNullable.control('', [Validators.required]),
        confirmPassword: this.fb.nonNullable.control('', [Validators.required]),
    });
    email = '';
    hash = '';
    isLoading = false;

    constructor() {
        this.hash = this.route.snapshot.queryParamMap.get('hash') ?? '';
        this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    }

    resetPassword() {
        const {password, confirmPassword} = this.form.getRawValue();
        if (password !== confirmPassword) {
            this.confirmationService.confirm({
                message: 'Passwords do not match. Please try again.',
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {}
            });
            return;
        }
        
        this.confirmationService.confirm({
            message: 'Are you sure you want to reset your password?',
            header: 'Confirm Password Reset',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.authService
                    .resetPassword(this.email, password, this.hash)
                    .then(() => {
                        this.confirmationService.confirm({
                            message: 'Password has been reset successfully! You will be redirected to login.',
                            header: 'Success',
                            icon: 'pi pi-check',
                            rejectButtonStyleClass: 'p-button-text',
                            accept: () => {
                                this.router.navigate(['/login']);
                            }
                        });
                        this.isLoading = false;
                    })
                    .catch(() => {
                        this.confirmationService.confirm({
                            message: 'Failed to reset password. Please try again.',
                            header: 'Error',
                            icon: 'pi pi-exclamation-triangle',
                            rejectButtonStyleClass: 'p-button-text',
                            accept: () => {}
                        });
                        this.isLoading = false;
                    });
            }
        });
    }
}
