import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate matching passwords', () => {
    component.registerForm.patchValue({
      fullName: 'Akshay Jadhav',
      email: 'akshay.jadhav@omni-bridge.com',
      companyName: 'Omni-Bridge Solutions',
      password: 'Password@123',
      confirmPassword: 'DifferentPassword@123',
      agreeToTerms: true
    });

    expect(component.registerForm.hasError('mustMatch')).toBe(true);

    component.registerForm.patchValue({
      confirmPassword: 'Password@123'
    });

    expect(component.registerForm.hasError('mustMatch')).toBe(false);
  });
});
