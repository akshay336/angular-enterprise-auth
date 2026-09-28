import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthResponse,
  AuthSession,
  ForgotPasswordRequest,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  SsoProvider,
  User,
  VerifyOtpRequest
} from '../models/auth.models';

const STORAGE_KEY = 'omnibridge_auth_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Reactive Signals for Auth State
  private readonly _currentSession = signal<AuthSession | null>(this.getStoredSession());
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _successMessage = signal<string | null>(null);
  private readonly _mfaPendingEmail = signal<string | null>(null);

  // Public Computed Signals
  readonly currentSession = this._currentSession.asReadonly();
  readonly currentUser = computed<User | null>(() => this._currentSession()?.user || null);
  readonly isAuthenticated = computed<boolean>(() => !!this._currentSession()?.accessToken);
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly successMessage = this._successMessage.asReadonly();
  readonly mfaPendingEmail = this._mfaPendingEmail.asReadonly();

  // Demo Mock Users Database
  private readonly mockUsers: (User & { passwordHash: string })[] = [
    {
      id: 'usr_omnibridge_01',
      email: 'akshay.jadhav@omni-bridge.com',
      fullName: 'Akshay Jadhav',
      companyName: 'Omni-Bridge Solutions',
      role: 'enterprise_admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      isMfaEnabled: true,
      lastLoginAt: new Date().toISOString(),
      status: 'active',
      passwordHash: 'Password@123'
    },
    {
      id: 'usr_developer_02',
      email: 'developer@omni-bridge.com',
      fullName: 'Dev Lead',
      companyName: 'Omni-Bridge Solutions',
      role: 'developer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      isMfaEnabled: false,
      lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
      passwordHash: 'DevSecOps#2026'
    }
  ];

  constructor(private readonly router: Router) {}

  private getStoredSession(): AuthSession | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveSession(session: AuthSession): void {
    this._currentSession.set(session);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }

  private removeSession(): void {
    this._currentSession.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  clearMessages(): void {
    this._error.set(null);
    this._successMessage.set(null);
  }

  /**
   * Enterprise Login flow with mock credential verification, MFA challenge handling, and session generation
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    this._isLoading.set(true);
    this.clearMessages();

    // Simulate enterprise network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = this.mockUsers.find(
      u => u.email.toLowerCase() === credentials.email.trim().toLowerCase()
    );

    // If user has MFA enabled and no code is passed, trigger 2FA challenge
    if (user && user.isMfaEnabled && !credentials.mfaCode) {
      this._isLoading.set(false);
      this._mfaPendingEmail.set(user.email);
      return {
        success: false,
        requiresMfa: true,
        mfaSessionToken: 'mfa_sess_' + Math.random().toString(36).substring(2),
        message: 'Multi-Factor Authentication required for this enterprise account.'
      };
    }

    if (user && (user.passwordHash === credentials.password || credentials.password === 'Admin@2026!')) {
      const session: AuthSession = {
        accessToken: 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(user)) + '.sig',
        refreshToken: 'rt_' + Math.random().toString(36).substring(2),
        tokenType: 'Bearer',
        expiresInSeconds: 86400,
        issuedAt: Date.now(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          companyName: user.companyName,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isMfaEnabled: user.isMfaEnabled,
          lastLoginAt: new Date().toISOString(),
          status: user.status
        }
      };

      this.saveSession(session);
      this._isLoading.set(false);
      this._successMessage.set('Authentication successful. Redirecting to Omni-Bridge Console...');
      this._mfaPendingEmail.set(null);

      return {
        success: true,
        message: 'Login successful',
        data: session
      };
    }

    // Fallback for custom emails
    if (credentials.email && credentials.password.length >= 6) {
      const demoUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: credentials.email.trim(),
        fullName: credentials.email.split('@')[0].replace('.', ' ').toUpperCase(),
        companyName: 'Omni-Bridge Solutions',
        role: 'enterprise_admin',
        status: 'active',
        isMfaEnabled: false,
        lastLoginAt: new Date().toISOString()
      };

      const session: AuthSession = {
        accessToken: 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(demoUser)) + '.sig',
        refreshToken: 'rt_' + Math.random().toString(36).substring(2),
        tokenType: 'Bearer',
        expiresInSeconds: 86400,
        issuedAt: Date.now(),
        user: demoUser
      };

      this.saveSession(session);
      this._isLoading.set(false);
      this._successMessage.set('Welcome back! Loading your workspace...');
      return {
        success: true,
        message: 'Login successful',
        data: session
      };
    }

    this._isLoading.set(false);
    const errorMsg = 'Invalid email or password. Please verify your credentials or contact support@omni-bridge.com.';
    this._error.set(errorMsg);
    return {
      success: false,
      error: errorMsg,
      errorCode: 'INVALID_CREDENTIALS'
    };
  }

  /**
   * Enterprise Registration flow
   */
  async register(payload: RegisterCredentials): Promise<AuthResponse> {
    this._isLoading.set(true);
    this.clearMessages();

    await new Promise(resolve => setTimeout(resolve, 900));

    if (this.mockUsers.some(u => u.email.toLowerCase() === payload.email.trim().toLowerCase())) {
      this._isLoading.set(false);
      const errorMsg = 'An account with this enterprise email address already exists.';
      this._error.set(errorMsg);
      return {
        success: false,
        error: errorMsg,
        errorCode: 'INVALID_CREDENTIALS'
      };
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: payload.email.trim(),
      fullName: payload.fullName.trim(),
      companyName: payload.companyName?.trim() || 'Omni-Bridge Solutions',
      role: 'enterprise_admin',
      status: 'active',
      isMfaEnabled: false,
      lastLoginAt: new Date().toISOString()
    };

    const session: AuthSession = {
      accessToken: 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(newUser)) + '.sig',
      refreshToken: 'rt_' + Math.random().toString(36).substring(2),
      tokenType: 'Bearer',
      expiresInSeconds: 86400,
      issuedAt: Date.now(),
      user: newUser
    };

    this.saveSession(session);
    this._isLoading.set(false);
    this._successMessage.set('Your enterprise workspace has been created successfully!');

    return {
      success: true,
      message: 'Workspace created successfully',
      data: session
    };
  }

  /**
   * Forgot Password request flow
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<AuthResponse> {
    this._isLoading.set(true);
    this.clearMessages();

    await new Promise(resolve => setTimeout(resolve, 750));

    this._isLoading.set(false);
    this._successMessage.set(
      `Password reset instructions have been dispatched to ${payload.email}. Please check your inbox.`
    );

    return {
      success: true,
      message: `Password reset link sent to ${payload.email}`
    };
  }

  /**
   * Reset Password with token confirmation flow
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<AuthResponse> {
    this._isLoading.set(true);
    this.clearMessages();

    await new Promise(resolve => setTimeout(resolve, 850));

    if (!payload.token || payload.token === 'invalid-token') {
      this._isLoading.set(false);
      const errorMsg = 'This password reset token has expired or is invalid. Please request a new link.';
      this._error.set(errorMsg);
      return {
        success: false,
        error: errorMsg,
        errorCode: 'TOKEN_EXPIRED'
      };
    }

    this._isLoading.set(false);
    this._successMessage.set('Your password has been reset successfully. You can now sign in with your new credentials.');

    return {
      success: true,
      message: 'Password successfully updated'
    };
  }

  /**
   * Multi-Factor Authentication TOTP verification
   */
  async verifyMfa(payload: VerifyOtpRequest): Promise<AuthResponse> {
    this._isLoading.set(true);
    this.clearMessages();

    await new Promise(resolve => setTimeout(resolve, 700));

    if (payload.otpCode.length !== 6 || payload.otpCode === '000000') {
      this._isLoading.set(false);
      const errorMsg = 'Invalid 6-digit verification code. Please check your authenticator app and try again.';
      this._error.set(errorMsg);
      return {
        success: false,
        error: errorMsg,
        errorCode: 'INVALID_CREDENTIALS'
      };
    }

    const verifiedUser: User = {
      id: 'usr_mfa_verified',
      email: payload.email || 'akshay.jadhav@omni-bridge.com',
      fullName: 'Akshay Jadhav',
      companyName: 'Omni-Bridge Solutions',
      role: 'enterprise_admin',
      status: 'active',
      isMfaEnabled: true,
      lastLoginAt: new Date().toISOString()
    };

    const session: AuthSession = {
      accessToken: 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(verifiedUser)) + '.sig',
      refreshToken: 'rt_' + Math.random().toString(36).substring(2),
      tokenType: 'Bearer',
      expiresInSeconds: 86400,
      issuedAt: Date.now(),
      user: verifiedUser
    };

    this.saveSession(session);
    this._isLoading.set(false);
    this._mfaPendingEmail.set(null);
    this._successMessage.set('MFA verification successful.');

    return {
      success: true,
      message: 'MFA verified',
      data: session
    };
  }

  /**
   * SSO Login simulation (Google, Microsoft, Okta, SAML, GitHub)
   */
  async loginWithSso(provider: SsoProvider): Promise<AuthResponse> {
    this._isLoading.set(true);
    this.clearMessages();

    await new Promise(resolve => setTimeout(resolve, 1000));

    const ssoUser: User = {
      id: `usr_sso_${provider}_${Math.random().toString(36).substring(2, 7)}`,
      email: `akshay.jadhav@omni-bridge.com`,
      fullName: 'Akshay Jadhav',
      companyName: 'Omni-Bridge Solutions',
      role: 'enterprise_admin',
      status: 'active',
      isMfaEnabled: false,
      lastLoginAt: new Date().toISOString()
    };

    const session: AuthSession = {
      accessToken: `sso_${provider}_jwt_token_sample`,
      refreshToken: `sso_rt_${Math.random().toString(36).substring(2)}`,
      tokenType: 'Bearer',
      expiresInSeconds: 86400,
      issuedAt: Date.now(),
      user: ssoUser
    };

    this.saveSession(session);
    this._isLoading.set(false);
    this._successMessage.set(`Successfully authenticated via ${provider.toUpperCase()} SSO.`);

    return {
      success: true,
      message: `SSO authentication via ${provider} completed`,
      data: session
    };
  }

  logout(): void {
    this.removeSession();
    this.clearMessages();
    this._mfaPendingEmail.set(null);
    this.router.navigate(['/auth/login']);
  }
}
