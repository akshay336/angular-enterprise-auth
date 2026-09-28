import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import { AuthConfig } from '../models/auth.models';

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  appName: 'OmniBridge',
  appSubtitle: 'Enterprise Identity & Access Management',
  supportEmail: 'support@omni-bridge.com',
  termsUrl: 'https://omni-bridge.com/#terms',
  privacyUrl: 'https://omni-bridge.com/#privacy',
  portalUrl: 'https://omni-bridge.com/',
  ssoProviders: ['google', 'microsoft', 'github', 'okta', 'saml'],
  requireCompanyField: true,
  enableRememberMe: true,
  enableMfaOption: true,
  showSocialAuth: true,
  testimonials: [
    {
      quote: 'OmniBridge unified our enterprise identity architecture with zero friction, providing scalable security, instant provisioning, and a modern developer-first authentication experience.',
      author: 'Akshay Jadhav',
      role: 'Angular Developer',
      company: 'Omni-Bridge Solutions',
      statNumber: '100%',
      statLabel: 'Modular & Enterprise Ready'
    },
    {
      quote: 'Deploying Omni-Bridge authentication across our multi-tenant SaaS applications reduced integration time from weeks to hours.',
      author: 'Engineering Lead',
      role: 'Core Systems Team',
      company: 'Omni-Bridge Solutions',
      statNumber: '< 50ms',
      statLabel: 'Average Token Verification'
    }
  ],
  featureHighlights: [
    {
      title: 'SOC-2 & Enterprise Compliance',
      description: 'End-to-end token encryption with continuous compliance telemetry.',
      icon: 'shield-check'
    },
    {
      title: 'Zero-Trust Architecture',
      description: 'Adaptive step-up MFA and real-time anomalous threat detection.',
      icon: 'key'
    },
    {
      title: 'Global SSO & SCIM',
      description: 'Direct SAML 2.0 and OIDC integrations for Okta, Azure AD, and Google Workspace.',
      icon: 'sparkles'
    }
  ]
};

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_AUTH_CONFIG
});

export type BrandTheme = 'indigo' | 'slate' | 'emerald' | 'violet' | 'rose';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  private readonly configOverride = inject(AUTH_CONFIG, { optional: true });

  readonly config = signal<AuthConfig>(this.configOverride || DEFAULT_AUTH_CONFIG);
  readonly currentTheme = signal<'dark' | 'light'>('light');
  readonly currentBrandColor = signal<BrandTheme>('indigo');

  constructor() {
    this.initThemeFromSystemOrStorage();
  }

  private initThemeFromSystemOrStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        if (window.localStorage) {
          const savedTheme = localStorage.getItem('omnibridge_auth_theme') as 'dark' | 'light' | null;
          if (savedTheme === 'dark' || savedTheme === 'light') {
            this.setTheme(savedTheme);
          } else {
            // Default to light theme
            this.setTheme('light');
          }

          const savedBrand = localStorage.getItem('omnibridge_auth_brand_color') as BrandTheme | null;
          if (savedBrand) {
            this.setBrandColor(savedBrand);
          }
        }
      } catch {
        this.setTheme('light');
      }
    }
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.currentTheme.set(theme);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${theme}`);
      try {
        localStorage?.setItem('omnibridge_auth_theme', theme);
      } catch {}
    }
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'dark' ? 'light' : 'dark');
  }

  setBrandColor(color: BrandTheme): void {
    this.currentBrandColor.set(color);
    if (typeof document !== 'undefined' && document.documentElement) {
      const root = document.documentElement;
      const hues: Record<BrandTheme, { h: number; s: string; l: string }> = {
        indigo: { h: 224, s: '76%', l: '48%' },
        slate: { h: 215, s: '25%', l: '40%' },
        emerald: { h: 160, s: '84%', l: '39%' },
        violet: { h: 262, s: '83%', l: '58%' },
        rose: { h: 346, s: '84%', l: '50%' }
      };

      const selected = hues[color];
      if (selected) {
        root.style.setProperty('--brand-primary-h', selected.h.toString());
        root.style.setProperty('--brand-primary-s', selected.s);
        root.style.setProperty('--brand-primary-l', selected.l);
        try {
          localStorage?.setItem('omnibridge_auth_brand_color', color);
        } catch {}
      }
    }
  }

  updateConfig(partial: Partial<AuthConfig>): void {
    this.config.update(current => ({ ...current, ...partial }));
  }
}
