import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthInputComponent } from './auth-input.component';

describe('AuthInputComponent', () => {
  let component: AuthInputComponent;
  let fixture: ComponentFixture<AuthInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthInputComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the auth input component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility when toggle button is clicked', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component.isPasswordVisible()).toBe(false);
    expect(component.resolvedType()).toBe('password');

    component.togglePasswordVisibility();
    fixture.detectChanges();

    expect(component.isPasswordVisible()).toBe(true);
    expect(component.resolvedType()).toBe('text');
  });

  it('should display error message when control is invalid and touched', () => {
    const control = new FormControl('', { nonNullable: true });
    control.setErrors({ required: true });
    control.markAsTouched();

    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('label', 'Work Email');
    fixture.detectChanges();

    expect(component.hasError()).toBe(true);
    expect(component.errorMessage()).toContain('Work Email is required');
  });
});
