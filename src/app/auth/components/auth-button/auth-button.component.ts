import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconName } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'sso' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.full-width]': 'fullWidth()'
  }
})
export class AuthButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(true);
  readonly icon = input<IconName | null>(null);
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<MouseEvent>();

  buttonClasses(): string {
    return `variant-${this.variant()} size-${this.size()}`;
  }

  iconSize(): number {
    return this.size() === 'sm' ? 16 : this.size() === 'lg' ? 20 : 18;
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
