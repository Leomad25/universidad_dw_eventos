import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenCameraComponent } from './screen-camera.component';

describe('ScreenCameraComponent', () => {
  let component: ScreenCameraComponent;
  let fixture: ComponentFixture<ScreenCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenCameraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
