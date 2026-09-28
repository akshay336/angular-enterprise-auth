import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthConfigService } from '../../services/auth-config.service';
import { SsoProvider, SsoProviderConfig } from '../../models/auth.models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sso-buttons',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './sso-buttons.component.html',
  styleUrl: './sso-buttons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsoButtonsComponent {
  private readonly configService = inject(AuthConfigService);

  readonly actionText = input<string>('Continue with');
  readonly loading = input<boolean>(false);
  readonly showSamlOption = input<boolean>(true);

  readonly providerSelected = output<SsoProvider>();

  private readonly allProviders: SsoProviderConfig[] = [
    { id: 'google', name: 'Google', icon: 'google' },
    { id: 'microsoft', name: 'Microsoft', icon: 'microsoft' },
    { id: 'github', name: 'GitHub', icon: 'github' }
  ];

  readonly activeProviders = computed<SsoProviderConfig[]>(() => {
    const configured = this.configService.config().ssoProviders;
    return this.allProviders.filter(p => configured.includes(p.id));
  });

  selectProvider(provider: SsoProvider): void {
    if (!this.loading()) {
      this.providerSelected.emit(provider);
    }
  }
}
