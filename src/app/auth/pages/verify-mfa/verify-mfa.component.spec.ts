import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VerifyMfaComponent } from './verify-mfa.component';

describe('VerifyMfaComponent', () => {
  let component: VerifyMfaComponent;
  let fixture: ComponentFixture<VerifyMfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyMfaComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the verify mfa component', () => {
    expect(component).toBeTruthy();
  });

  it('should recognize complete 6-digit OTP code', () => {
    expect(component.isOtpComplete()).toBe(false);
    component.fillDemoOtp('123456');
    expect(component.isOtpComplete()).toBe(true);
  });
});
