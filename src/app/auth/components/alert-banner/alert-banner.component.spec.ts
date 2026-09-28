import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertBannerComponent } from './alert-banner.component';

describe('AlertBannerComponent', () => {
  let component: AlertBannerComponent;
  let fixture: ComponentFixture<AlertBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the alert banner component', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss alert and emit dismissed event', () => {
    let emitted = false;
    component.dismissed.subscribe(() => (emitted = true));

    component.handleDismiss();
    expect(component.isVisible()).toBe(false);
    expect(emitted).toBe(true);
  });
});
