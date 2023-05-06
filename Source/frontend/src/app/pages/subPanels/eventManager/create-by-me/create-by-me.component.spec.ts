import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateByMeComponent } from './create-by-me.component';

describe('CreateByMeComponent', () => {
  let component: CreateByMeComponent;
  let fixture: ComponentFixture<CreateByMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateByMeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateByMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
