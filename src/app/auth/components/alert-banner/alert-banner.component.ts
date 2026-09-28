import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertBannerComponent {
  readonly type = input<'error' | 'success' | 'warning' | 'info'>('error');
  readonly title = input<string | null>(null);
  readonly message = input<string | null>(null);
  readonly dismissible = input<boolean>(true);

  readonly dismissed = output<void>();
  readonly isVisible = signal<boolean>(true);

  iconForType(): IconName {
    switch (this.type()) {
      case 'error': return 'alert-circle';
      case 'success': return 'check-circle';
      case 'warning': return 'alert-circle';
      case 'info': return 'info';
    }
  }

  handleDismiss(): void {
    this.isVisible.set(false);
    this.dismissed.emit();
  }
}
