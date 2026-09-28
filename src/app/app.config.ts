import { ApplicationConfig, EnvironmentProviders, Provider, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { AUTH_CONFIG } from './auth/services/auth-config.service';
import { AuthConfig } from './auth/models/auth.models';

/**
 * Enterprise Provider Helper for custom brand configuration
 */
export function provideAuthConfig(config: Partial<AuthConfig>): Provider {
  return {
    provide: AUTH_CONFIG,
    useValue: config
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
