import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceForMachineComponent } from './trace-for-machine.component';

describe('TraceForMachineComponent', () => {
  let component: TraceForMachineComponent;
  let fixture: ComponentFixture<TraceForMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceForMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceForMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
