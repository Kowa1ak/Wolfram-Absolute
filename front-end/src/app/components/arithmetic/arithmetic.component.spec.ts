import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArithmeticComponent } from './arithmetic.component';

describe('ArithmeticComponent', () => {
  let component: ArithmeticComponent;
  let fixture: ComponentFixture<ArithmeticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArithmeticComponent]
    });
    fixture = TestBed.createComponent(ArithmeticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
