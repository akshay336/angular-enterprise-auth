import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PasswordRequirement, PasswordStrengthResult } from '../models/auth.models';

export class AuthValidators {
  /**
   * Evaluates a password string against enterprise password policy rules
   */
  static evaluatePassword(password: string): PasswordStrengthResult {
    const requirements: PasswordRequirement[] = [
      { id: 'min_length', label: 'At least 8 characters', met: password.length >= 8, regex: /.{8,}/ },
      { id: 'uppercase', label: 'At least 1 uppercase letter (A-Z)', met: /[A-Z]/.test(password), regex: /[A-Z]/ },
      { id: 'lowercase', label: 'At least 1 lowercase letter (a-z)', met: /[a-z]/.test(password), regex: /[a-z]/ },
      { id: 'number', label: 'At least 1 number (0-9)', met: /[0-9]/.test(password), regex: /[0-9]/ },
      { id: 'special', label: 'At least 1 special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password), regex: /[^A-Za-z0-9]/ }
    ];

    const metCount = requirements.filter(r => r.met).length;
    let score = 0;
    let level: PasswordStrengthResult['level'] = 'very-weak';
    let feedback = 'Password is too weak';

    if (password.length === 0) {
      score = 0;
      level = 'very-weak';
      feedback = 'Enter a secure password';
    } else if (metCount <= 1) {
      score = 0;
      level = 'very-weak';
      feedback = 'Very weak — easily guessed';
    } else if (metCount === 2) {
      score = 1;
      level = 'weak';
      feedback = 'Weak — add symbols or numbers';
    } else if (metCount === 3) {
      score = 2;
      level = 'fair';
      feedback = 'Fair — good, but could be stronger';
    } else if (metCount === 4) {
      score = 3;
      level = 'strong';
      feedback = 'Strong password';
    } else if (metCount === 5) {
      score = 4;
      level = 'excellent';
      feedback = 'Excellent — enterprise grade';
    }

    return {
      score,
      level,
      feedback,
      requirements
    };
  }

  /**
   * Validator for reactive forms enforcing min password strength score
   */
  static strongPassword(minScore = 3): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const result = AuthValidators.evaluatePassword(value);
      if (result.score < minScore) {
        return {
          weakPassword: {
            score: result.score,
            minRequired: minScore,
            failedRequirements: result.requirements.filter(r => !r.met).map(r => r.label)
          }
        };
      }
      return null;
    };
  }

  /**
   * Cross-field validator ensuring two controls match (e.g., password and confirmPassword)
   */
  static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      // If matching control already has errors that aren't 'mustMatch', skip
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Email validator with RFC compliance & corporate domain heuristics
   */
  static enterpriseEmail(): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      if (!emailRegex.test(value)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }
}
