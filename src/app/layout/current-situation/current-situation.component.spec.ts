import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSituationComponent } from './current-situation.component';

describe('CurrentSituationComponent', () => {
  let component: CurrentSituationComponent;
  let fixture: ComponentFixture<CurrentSituationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSituationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSituationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
