import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Sign In');
    fixture.detectChanges();
  });

  it('should create the auth layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the specified title in the header', () => {
    const titleEl = fixture.nativeElement.querySelector('.auth-card-title');
    expect(titleEl.textContent).toContain('Sign In');
  });
});
