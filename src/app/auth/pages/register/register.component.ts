import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthConfigService } from '../../services/auth-config.service';
import { SsoProvider } from '../../models/auth.models';
import { AuthValidators } from '../../validators/auth.validators';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthInputComponent } from '../../components/auth-input/auth-input.component';
import { AuthButtonComponent } from '../../components/auth-button/auth-button.component';
import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { SsoButtonsComponent } from '../../components/sso-buttons/sso-buttons.component';
import { PasswordStrengthMeterComponent } from '../../components/password-strength-meter/password-strength-meter.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    AuthInputComponent,
    AuthButtonComponent,
    AlertBannerComponent,
    SsoButtonsComponent,
    PasswordStrengthMeterComponent,
    IconComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  readonly themeService = inject(AuthConfigService);
  private readonly router = inject(Router);

  registerForm!: FormGroup;

  get passwordValue(): string {
    return this.registerForm?.get('password')?.value || '';
  }

  ngOnInit(): void {
    this.authService.clearMessages();

    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, AuthValidators.enterpriseEmail()]],
        companyName: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, Validators.minLength(8), AuthValidators.strongPassword(3)]],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]]
      },
      {
        validators: [AuthValidators.mustMatch('password', 'confirmPassword')]
      }
    );
  }

  async handleSsoSignUp(provider: SsoProvider): Promise<void> {
    const res = await this.authService.loginWithSso(provider);
    if (res.success) {
      setTimeout(() => this.router.navigate(['/dashboard']), 500);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password, companyName, agreeToTerms } = this.registerForm.value;
    const res = await this.authService.register({
      fullName,
      email,
      password,
      companyName,
      agreeToTerms
    });

    if (res.success) {
      setTimeout(() => this.router.navigate(['/dashboard']), 600);
    }
  }
}
