import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthConfigService } from '../../services/auth-config.service';
import { SsoProvider } from '../../models/auth.models';
import { AuthValidators } from '../../validators/auth.validators';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthInputComponent } from '../../components/auth-input/auth-input.component';
import { AuthButtonComponent } from '../../components/auth-button/auth-button.component';
import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { SsoButtonsComponent } from '../../components/sso-buttons/sso-buttons.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-login',
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
    IconComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  readonly themeService = inject(AuthConfigService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  returnUrl = '/dashboard';

  ngOnInit(): void {
    this.authService.clearMessages();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, AuthValidators.enterpriseEmail()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });
  }

  fillDemoCredentials(role: 'admin' | 'developer'): void {
    if (role === 'admin') {
      this.loginForm.patchValue({
        email: 'akshay.jadhav@omni-bridge.com',
        password: 'Password@123',
        rememberMe: true
      });
    } else {
      this.loginForm.patchValue({
        email: 'developer@omni-bridge.com',
        password: 'DevSecOps#2026',
        rememberMe: true
      });
    }
    this.loginForm.markAsDirty();
  }

  async handleSsoLogin(provider: SsoProvider): Promise<void> {
    const res = await this.authService.loginWithSso(provider);
    if (res.success) {
      setTimeout(() => this.router.navigateByUrl(this.returnUrl), 500);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;
    const res = await this.authService.login({ email, password, rememberMe });

    if (res.success) {
      setTimeout(() => this.router.navigateByUrl(this.returnUrl), 400);
    } else if (res.requiresMfa) {
      this.router.navigate(['/auth/verify-mfa'], {
        queryParams: { email, token: res.mfaSessionToken }
      });
    }
  }
}
