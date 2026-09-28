import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP Interceptor for enterprise JWT Bearer token injection
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const session = authService.currentSession();

  if (session?.accessToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `${session.tokenType} ${session.accessToken}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
