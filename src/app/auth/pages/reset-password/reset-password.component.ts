import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthValidators } from '../../validators/auth.validators';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthInputComponent } from '../../components/auth-input/auth-input.component';
import { AuthButtonComponent } from '../../components/auth-button/auth-button.component';
import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { PasswordStrengthMeterComponent } from '../../components/password-strength-meter/password-strength-meter.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    AuthInputComponent,
    AuthButtonComponent,
    AlertBannerComponent,
    PasswordStrengthMeterComponent,
    IconComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  resetForm!: FormGroup;
  token = 'demo_valid_token';
  targetUserEmail = 'akshay.jadhav@omni-bridge.com';

  readonly isTokenExpired = signal<boolean>(false);
  readonly isResetSuccessful = signal<boolean>(false);

  readonly pageTitle = computed(() => {
    return this.isResetSuccessful() ? 'Password updated' : 'Set a new password';
  });

  readonly pageSubtitle = computed(() => {
    return this.isResetSuccessful()
      ? 'Your enterprise credentials have been securely updated.'
      : 'Ensure your new password meets your organization password policy standards.';
  });

  get newPasswordValue(): string {
    return this.resetForm?.get('newPassword')?.value || '';
  }

  ngOnInit(): void {
    this.authService.clearMessages();
    this.token = this.route.snapshot.queryParams['token'] || 'omnibridge_sec_demo_tok_99182';

    if (this.token === 'expired') {
      this.isTokenExpired.set(true);
      return;
    }

    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8), AuthValidators.strongPassword(3)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [AuthValidators.mustMatch('newPassword', 'confirmPassword')]
      }
    );
  }

  async onSubmit(): Promise<void> {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;
    const res = await this.authService.resetPassword({
      token: this.token,
      newPassword,
      confirmPassword
    });

    if (res.success) {
      this.isResetSuccessful.set(true);
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
