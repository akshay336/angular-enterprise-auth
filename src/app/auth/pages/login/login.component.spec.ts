import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with invalid form by default', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should fill demo credentials when fillDemoCredentials is called', () => {
    component.fillDemoCredentials('admin');
    expect(component.loginForm.get('email')?.value).toBe('akshay.jadhav@omni-bridge.com');
    expect(component.loginForm.valid).toBe(true);
  });
});
