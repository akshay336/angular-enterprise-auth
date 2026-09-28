import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconName } from '../../models/auth.models';

export type { IconName };

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(18);
}
