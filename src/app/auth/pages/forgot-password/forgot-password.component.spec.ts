import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, ReactiveFormsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the forgot password component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate enterprise email input', () => {
    component.forgotForm.patchValue({ email: 'invalid-email' });
    expect(component.forgotForm.valid).toBe(false);

    component.forgotForm.patchValue({ email: 'akshay.jadhav@omni-bridge.com' });
    expect(component.forgotForm.valid).toBe(true);
  });
});
