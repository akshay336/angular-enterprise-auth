/**
 * Enterprise Authentication Models and Data Contracts
 */

export type IconName =
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'user'
  | 'building'
  | 'shield-check'
  | 'shield'
  | 'arrow-left'
  | 'arrow-right'
  | 'google'
  | 'microsoft'
  | 'github'
  | 'okta'
  | 'saml'
  | 'check'
  | 'alert-circle'
  | 'check-circle'
  | 'info'
  | 'sun'
  | 'moon'
  | 'sparkles'
  | 'key'
  | 'external-link'
  | 'fingerprint'
  | 'chevron-right'
  | 'x'
  | 'refresh'
  | 'laptop';

export interface User {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  role: 'super_admin' | 'enterprise_admin' | 'developer' | 'viewer';
  avatarUrl?: string;
  isMfaEnabled?: boolean;
  lastLoginAt?: string;
  status: 'active' | 'pending_verification' | 'locked';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  companyName?: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
  issuedAt: number;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: AuthSession;
  requiresMfa?: boolean;
  mfaSessionToken?: string;
  error?: string;
  errorCode?: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'EMAIL_NOT_VERIFIED' | 'TOKEN_EXPIRED' | 'MFA_REQUIRED' | 'RATE_LIMITED' | 'UNKNOWN';
}

export type SsoProvider = 'google' | 'microsoft' | 'github' | 'okta' | 'saml';

export interface SsoProviderConfig {
  id: SsoProvider;
  name: string;
  icon: IconName;
  isEnterpriseOnly?: boolean;
}

export interface TestimonialConfig {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  statNumber?: string;
  statLabel?: string;
}

export interface AuthConfig {
  appName: string;
  appSubtitle: string;
  appLogoSvg?: string;
  portalUrl?: string;
  supportEmail: string;
  termsUrl: string;
  privacyUrl: string;
  ssoProviders: SsoProvider[];
  requireCompanyField: boolean;
  enableRememberMe: boolean;
  enableMfaOption: boolean;
  showSocialAuth: boolean;
  testimonials: TestimonialConfig[];
  featureHighlights: { title: string; description: string; icon: IconName }[];
}

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
  regex: RegExp;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  level: 'very-weak' | 'weak' | 'fair' | 'strong' | 'excellent';
  feedback: string;
  requirements: PasswordRequirement[];
}

export interface AuthAlert {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  title?: string;
  dismissible?: boolean;
}
