import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardEditComponent } from './event-card-edit.component';

describe('EventCardEditComponent', () => {
  let component: EventCardEditComponent;
  let fixture: ComponentFixture<EventCardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCardEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
