import { ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { AuthButtonComponent } from '../../components/auth-button/auth-button.component';
import { AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-verify-mfa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayoutComponent,
    AuthButtonComponent,
    AlertBannerComponent,
    IconComponent
  ],
  templateUrl: './verify-mfa.component.html',
  styleUrl: './verify-mfa.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyMfaComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly digits = Array(6).fill(0);
  readonly otpValues = signal<string[]>(['', '', '', '', '', '']);
  readonly userEmail = signal<string>('akshay.jadhav@omni-bridge.com');

  ngOnInit(): void {
    this.authService.clearMessages();
    const qEmail = this.route.snapshot.queryParams['email'];
    if (qEmail) {
      this.userEmail.set(qEmail);
    }
  }

  isOtpComplete(): boolean {
    return this.otpValues().every(v => v.length === 1);
  }

  fillDemoOtp(code: string): void {
    const chars = code.split('').slice(0, 6);
    this.otpValues.set(chars);
  }

  handleInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value) {
      const singleChar = value.slice(-1);
      const current = [...this.otpValues()];
      current[index] = singleChar;
      this.otpValues.set(current);

      if (index < 5) {
        const inputsArray = this.otpInputs.toArray();
        inputsArray[index + 1]?.nativeElement.focus();
      }
    }
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const current = [...this.otpValues()];
      if (!current[index] && index > 0) {
        const inputsArray = this.otpInputs.toArray();
        inputsArray[index - 1]?.nativeElement.focus();
      } else {
        current[index] = '';
        this.otpValues.set(current);
      }
    }
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text').trim() || '';
    const cleanDigits = pasteData.replace(/\D/g, '').split('').slice(0, 6);

    if (cleanDigits.length > 0) {
      const newValues = [...this.otpValues()];
      cleanDigits.forEach((d, i) => {
        newValues[i] = d;
      });
      this.otpValues.set(newValues);

      const nextFocusIndex = Math.min(cleanDigits.length, 5);
      this.otpInputs.toArray()[nextFocusIndex]?.nativeElement.focus();
    }
  }

  useBackupCode(): void {
    this.fillDemoOtp('994821');
  }

  async onSubmit(): Promise<void> {
    const code = this.otpValues().join('');
    if (code.length !== 6) return;

    const res = await this.authService.verifyMfa({
      email: this.userEmail(),
      otpCode: code
    });

    if (res.success) {
      setTimeout(() => this.router.navigate(['/dashboard']), 500);
    }
  }
}
