import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Enterprise Route Guard: Prevents unauthenticated access to protected routes
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with returnUrl
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: router.routerState.snapshot.url }
  });
};
