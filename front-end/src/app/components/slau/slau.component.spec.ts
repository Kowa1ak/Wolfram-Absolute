import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlauComponent } from './slau.component';

describe('SlauComponent', () => {
  let component: SlauComponent;
  let fixture: ComponentFixture<SlauComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlauComponent]
    });
    fixture = TestBed.createComponent(SlauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
