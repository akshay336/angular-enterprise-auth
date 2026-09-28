# 🔐 Angular Enterprise Authentication & IAM Suite

[![CI/CD & Deploy to GitHub Pages](https://github.com/akshay336/angular-enterprise-auth/actions/workflows/deploy.yml/badge.svg)](https://github.com/akshay336/angular-enterprise-auth/actions/workflows/deploy.yml)
[![Angular](https://img.shields.io/badge/Angular-21.1-dd0031.svg?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6e9f18.svg?logo=vitest)](https://vitest.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A reusable, production-ready **Enterprise Identity & Access Management (IAM) frontend module** built with the latest stable version of Angular. Designed with a clean SaaS aesthetic, robust security validation, reactive state management using Angular Signals, and comprehensive unit test coverage.

🌐 **Live Demo:** [https://akshay336.github.io/angular-enterprise-auth/](https://akshay336.github.io/angular-enterprise-auth/)

---

## 🚀 Key Features

* **🛡️ Production-Ready Enterprise Screens:**
  * **Sign In / Login:** Work email & password authentication, SSO provider integration (Google, Microsoft, GitHub, Okta, SAML), remember-me persistence, and quick demo credentials auto-fill.
  * **Registration / Sign Up:** Company name collection, matching password validation, live password complexity meter, and terms & privacy agreement toggles.
  * **Forgot Password:** Work email reset link dispatcher with simulated countdown timers and resend throttling.
  * **Reset Password:** Cryptographic token verification, live validation checklist, and secure password update handler.
  * **Two-Factor / MFA Verification:** 6-digit split OTP input boxes with automatic focus advancement, paste handling, and emergency backup codes.
  * **Authenticated Dashboard:** Protected route showcasing user profile metadata, active token inspect, and security telemetry.
* **⚡ Modern Angular Architecture:**
  * **Standalone Components:** 100% standalone architecture with no `NgModule` overhead.
  * **Angular Signals:** Fine-grained reactive state for authentication status, active user sessions, and theme tokens.
  * **Traditional 4-File Component Structure:** Strict enterprise structure (`.ts`, `.html`, `.css`, `.spec.ts`) for all components.
  * **Custom Enterprise Validators:** Strong password regex rules, matching password checks, and enterprise email domain filters.
  * **Functional Guards & Interceptors:** `authGuard` (protects dashboard), `guestGuard` (redirects logged-in users), and `authInterceptor` (attaches Bearer tokens to API calls).
* **🎨 Enterprise Design System:**
  * **Default Light Theme** with seamless Dark Mode toggle.
  * **Dynamic Brand Palette Customizer:** Switch live brand hues (Indigo, Slate, Emerald, Violet, Rose) with CSS variables.
  * **Compact, High-Efficiency Layout:** Optimized spacing and zero unnecessary vertical scrollbars on standard viewports.
  * **Accessible & Responsive:** Accessible form controls, screen reader tags (`.sr-only`), and fluid mobile-to-desktop grid transitions.
* **🧪 100% Unit Test Coverage:**
  * 32 unit tests across 15 component and service spec suites using Vitest.

---

## 📂 Project Architecture

```text
src/app/
├── auth/
│   ├── components/
│   │   ├── alert-banner/          # Dynamic toast / alert banners
│   │   ├── auth-button/           # Reusable loading & state button
│   │   ├── auth-input/            # Accessible input with icons & validation
│   │   ├── auth-layout/           # Split layout with enterprise branding side panel
│   │   ├── icon/                  # SVG icon library component
│   │   ├── password-strength-meter/# Real-time password requirement checklist
│   │   ├── screen-switcher/       # Floating screen preview & theme customizer dock
│   │   └── sso-buttons/           # Social and enterprise SSO login buttons
│   ├── guards/
│   │   ├── auth.guard.ts          # Protects private routes
│   │   └── guest.guard.ts         # Prevents authenticated users from seeing login
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # Attaches Bearer JWT tokens to HTTP requests
│   ├── models/
│   │   └── auth.models.ts         # TypeScript models, DTOs, and configs
│   ├── pages/
│   │   ├── forgot-password/       # Forgot password screen
│   │   ├── login/                 # Login screen
│   │   ├── register/              # Registration screen
│   │   ├── reset-password/        # Reset password screen
│   │   └── verify-mfa/            # Two-factor authentication screen
│   ├── services/
│   │   ├── auth.service.ts        # Authentication state & mock backend API
│   │   └── auth-config.service.ts # Configurable branding & theme engine
│   ├── validators/
│   │   └── auth.validators.ts     # Enterprise reactive form validators
│   └── auth.routes.ts             # Auth sub-routing configuration
├── dashboard/                     # Authenticated dashboard console
├── app.routes.ts                  # Root application routing
└── styles.css                     # Global design tokens and theme variables
```

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (or newer)
* **npm**: `v10.x` or newer

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akshay336/angular-enterprise-auth.git
   cd angular-enterprise-auth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

---

## 🧪 Running Unit Tests

Run all unit tests with the Vitest runner:
```bash
npm test -- --watch=false
```

---

## 🚀 Building & GitHub Pages CI/CD

### Local Production Build
```bash
npm run build
```

### GitHub Pages Build
```bash
npm run build:gh-pages
```

### Automated CI/CD Workflow
This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:
1. Triggers on every push to `main`.
2. Installs dependencies (`npm ci`).
3. Runs all 32 unit tests (`npm test -- --watch=false`).
4. Compiles the optimized production bundle with `--base-href /angular-enterprise-auth/`.
5. Creates a fallback `404.html` for single-page app (SPA) client-side routing on GitHub Pages.
6. Deploys the build artifacts directly to **GitHub Pages**.

#### Enabling GitHub Pages in your Repository:
1. Go to your repository **Settings** on GitHub: `https://github.com/akshay336/angular-enterprise-auth/settings/pages`
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push your commits to `main` to trigger the automated deployment pipeline.

---

## 📄 License
This project is licensed under the MIT License.
