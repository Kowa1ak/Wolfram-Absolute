import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundInterestComponent } from './compound-interest.component';

describe('CompoundInterestComponent', () => {
  let component: CompoundInterestComponent;
  let fixture: ComponentFixture<CompoundInterestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompoundInterestComponent]
    });
    fixture = TestBed.createComponent(CompoundInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
