import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { AuthConfigService } from '../auth/services/auth-config.service';
import { IconComponent } from '../auth/components/icon/icon.component';
import { AuthButtonComponent } from '../auth/components/auth-button/auth-button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, AuthButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(AuthConfigService);
  private readonly router = inject(Router);

  readonly selectedTab = signal<'overview' | 'code' | 'session'>('overview');
  readonly currentUser = this.authService.currentUser;

  readonly sessionJson = computed(() => {
    const session = this.authService.currentSession();
    return session ? JSON.stringify(session, null, 2) : 'No active session payload';
  });

  handleLogout(): void {
    this.authService.logout();
  }
}
