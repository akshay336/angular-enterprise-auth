import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthValidators } from '../../validators/auth.validators';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthInputComponent } from '../../components/auth-input/auth-input.component';
import { AuthButtonComponent } from '../../components/auth-button/auth-button.component';
import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    AuthInputComponent,
    AuthButtonComponent,
    AlertBannerComponent,
    IconComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);

  forgotForm!: FormGroup;
  readonly isEmailSent = signal<boolean>(false);
  readonly targetEmail = signal<string>('');
  readonly resendCooldown = signal<number>(60);

  private timerInterval: any = null;

  ngOnInit(): void {
    this.authService.clearMessages();
    this.forgotForm = this.fb.group({
      email: ['akshay.jadhav@omni-bridge.com', [Validators.required, AuthValidators.enterpriseEmail()]]
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startResendTimer(): void {
    this.resendCooldown.set(60);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (this.resendCooldown() > 0) {
        this.resendCooldown.update(v => v - 1);
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  async handleResend(): Promise<void> {
    const email = this.targetEmail();
    if (!email) return;
    const res = await this.authService.forgotPassword({ email });
    if (res.success) {
      this.startResendTimer();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = this.forgotForm.value.email;
    const res = await this.authService.forgotPassword({ email });

    if (res.success) {
      this.targetEmail.set(email);
      this.isEmailSent.set(true);
      this.startResendTimer();
    }
  }
}
