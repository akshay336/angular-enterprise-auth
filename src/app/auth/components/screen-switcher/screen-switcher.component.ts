import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthConfigService, BrandTheme } from '../../services/auth-config.service';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-screen-switcher',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './screen-switcher.component.html',
  styleUrl: './screen-switcher.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenSwitcherComponent {
  readonly themeService = inject(AuthConfigService);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly isCollapsed = signal<boolean>(true);

  readonly brandColors: { id: BrandTheme; name: string; hex: string }[] = [
    { id: 'indigo', name: 'Indigo Blue', hex: '#4f46e5' },
    { id: 'slate', name: 'Executive Slate', hex: '#475569' },
    { id: 'emerald', name: 'Cyber Emerald', hex: '#059669' },
    { id: 'violet', name: 'Electric Violet', hex: '#7c3aed' },
    { id: 'rose', name: 'Crimson Rose', hex: '#e11d48' }
  ];
}
