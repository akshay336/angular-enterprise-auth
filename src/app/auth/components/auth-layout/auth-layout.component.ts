import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthConfigService } from '../../services/auth-config.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {
  readonly themeService = inject(AuthConfigService);

  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly badgeText = input<string | null>(null);
  readonly showBackLink = input<boolean>(false);
  readonly backLinkUrl = input<string | null>(null);
  readonly backLinkLabel = input<string | null>(null);

  readonly config = this.themeService.config;

  readonly activeTestimonial = computed(() => {
    const list = this.config().testimonials;
    return list[0] || {
      quote: 'OmniBridge unified our enterprise identity architecture with zero friction, providing scalable security, instant provisioning, and a modern developer-first authentication experience.',
      author: 'Akshay Jadhav',
      role: 'Angular Developer',
      company: 'Omni-Bridge Solutions',
      statNumber: '100%',
      statLabel: 'Enterprise Ready'
    };
  });
}
