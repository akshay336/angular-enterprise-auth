import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-auth-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthInputComponent),
      multi: true
    }
  ],
  templateUrl: './auth-input.component.html',
  styleUrl: './auth-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthInputComponent implements ControlValueAccessor {
  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  readonly inputId = input<string>('input-' + Math.random().toString(36).substring(2, 9));
  readonly label = input<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'tel' | 'number'>('text');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('off');
  readonly prefixIcon = input<IconName | null>(null);
  readonly hint = input<string | null>(null);
  readonly required = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly customError = input<string | null>(null);
  readonly control = input<FormControl | null>(null);

  hasSuffixSlot = false;

  readonly value = signal<string>('');
  readonly isFocused = signal<boolean>(false);
  readonly isDisabled = signal<boolean>(false);
  readonly isPasswordVisible = signal<boolean>(false);

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  resolvedType(): string {
    if (this.type() === 'password') {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return this.type();
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update(visible => !visible);
  }

  hasError(): boolean {
    if (this.customError()) {
      return true;
    }
    const ctrl = this.control();
    if (ctrl) {
      return ctrl.invalid && (ctrl.dirty || ctrl.touched);
    }
    return false;
  }

  errorMessage(): string | null {
    if (this.customError()) {
      return this.customError();
    }
    const ctrl = this.control();
    if (!ctrl || !ctrl.errors || !(ctrl.dirty || ctrl.touched)) {
      return null;
    }

    const errors = ctrl.errors;
    if (errors['required']) {
      return `${this.label() || 'This field'} is required.`;
    }
    if (errors['email'] || errors['invalidEmail']) {
      return 'Please enter a valid work email address.';
    }
    if (errors['minlength']) {
      return `Must be at least ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['mustMatch']) {
      return 'Passwords do not match.';
    }
    if (errors['weakPassword']) {
      return 'Password does not meet enterprise security requirements.';
    }
    if (errors['pattern']) {
      return 'Input format is invalid.';
    }
    return 'Invalid field value.';
  }

  ariaDescribedBy(): string | null {
    if (this.hasError()) {
      return this.errorId();
    }
    if (this.hint()) {
      return this.hintId();
    }
    return null;
  }

  errorId(): string {
    return `${this.inputId()}-error`;
  }

  hintId(): string {
    return `${this.inputId()}-hint`;
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  handleFocus(): void {
    this.isFocused.set(true);
  }

  handleBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
