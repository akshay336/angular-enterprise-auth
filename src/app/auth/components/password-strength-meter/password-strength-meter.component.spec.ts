import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordStrengthMeterComponent } from './password-strength-meter.component';

describe('PasswordStrengthMeterComponent', () => {
  let component: PasswordStrengthMeterComponent;
  let fixture: ComponentFixture<PasswordStrengthMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthMeterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the strength meter component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute strength score based on password complexity', () => {
    fixture.componentRef.setInput('password', 'Secret@2026!');
    fixture.detectChanges();

    const evaluation = component.evaluation();
    expect(evaluation.score).toBeGreaterThanOrEqual(4);
    expect(evaluation.level).toBe('excellent');
  });
});
