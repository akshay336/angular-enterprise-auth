import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, ReactiveFormsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the reset password component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form if passwords do not match', () => {
    component.resetForm.patchValue({
      newPassword: 'Password@123',
      confirmPassword: 'DifferentPassword@123'
    });

    expect(component.resetForm.valid).toBe(false);
  });
});
