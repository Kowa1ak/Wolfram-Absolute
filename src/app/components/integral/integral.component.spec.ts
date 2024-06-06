import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegralComponent } from './integral.component';

describe('IntegralComponent', () => {
  let component: IntegralComponent;
  let fixture: ComponentFixture<IntegralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntegralComponent]
    });
    fixture = TestBed.createComponent(IntegralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
