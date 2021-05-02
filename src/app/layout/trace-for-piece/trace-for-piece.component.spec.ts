import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceForPieceComponent } from './trace-for-piece.component';

describe('TraceForPieceComponent', () => {
  let component: TraceForPieceComponent;
  let fixture: ComponentFixture<TraceForPieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceForPieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceForPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
