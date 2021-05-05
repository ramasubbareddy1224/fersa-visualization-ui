import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceForZ3m21Component } from './trace-for-z3m21.component';

describe('TraceForZ3m21Component', () => {
  let component: TraceForZ3m21Component;
  let fixture: ComponentFixture<TraceForZ3m21Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceForZ3m21Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceForZ3m21Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
