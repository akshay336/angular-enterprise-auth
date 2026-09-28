import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SsoButtonsComponent } from './sso-buttons.component';

describe('SsoButtonsComponent', () => {
  let component: SsoButtonsComponent;
  let fixture: ComponentFixture<SsoButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsoButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SsoButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the sso buttons component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected provider when button is clicked', () => {
    let selectedProvider = '';
    component.providerSelected.subscribe(p => (selectedProvider = p));

    component.selectProvider('google');
    expect(selectedProvider).toBe('google');
  });
});
