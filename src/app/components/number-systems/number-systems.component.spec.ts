import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberSystemsComponent } from './number-systems.component';

describe('NumberSystemsComponent', () => {
  let component: NumberSystemsComponent;
  let fixture: ComponentFixture<NumberSystemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumberSystemsComponent]
    });
    fixture = TestBed.createComponent(NumberSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
