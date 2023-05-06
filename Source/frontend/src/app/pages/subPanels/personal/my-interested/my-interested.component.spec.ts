import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInterestedComponent } from './my-interested.component';

describe('MyInterestedComponent', () => {
  let component: MyInterestedComponent;
  let fixture: ComponentFixture<MyInterestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyInterestedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInterestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
