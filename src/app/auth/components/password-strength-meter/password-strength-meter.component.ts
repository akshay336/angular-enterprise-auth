import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthValidators } from '../../validators/auth.validators';
import { PasswordStrengthResult } from '../../models/auth.models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-password-strength-meter',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './password-strength-meter.component.html',
  styleUrl: './password-strength-meter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordStrengthMeterComponent {
  readonly password = input<string>('');
  readonly showRequirements = input<boolean>(true);

  readonly evaluation = computed<PasswordStrengthResult>(() => {
    return AuthValidators.evaluatePassword(this.password());
  });
}
