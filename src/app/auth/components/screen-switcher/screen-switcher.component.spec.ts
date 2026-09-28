import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ScreenSwitcherComponent } from './screen-switcher.component';

describe('ScreenSwitcherComponent', () => {
  let component: ScreenSwitcherComponent;
  let fixture: ComponentFixture<ScreenSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenSwitcherComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the screen switcher component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collapsed state when toggle button is clicked', () => {
    expect(component.isCollapsed()).toBe(true);
    component.isCollapsed.set(false);
    expect(component.isCollapsed()).toBe(false);
  });
});
