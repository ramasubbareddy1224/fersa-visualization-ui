import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContMeasureReportComponent } from './cont-measure-report.component';

describe('ContMeasureReportComponent', () => {
  let component: ContMeasureReportComponent;
  let fixture: ComponentFixture<ContMeasureReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContMeasureReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContMeasureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
