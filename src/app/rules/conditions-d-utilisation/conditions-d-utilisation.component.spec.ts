import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsDUtilisationComponent } from './conditions-d-utilisation.component';

describe('ConditionsDUtilisationComponent', () => {
  let component: ConditionsDUtilisationComponent;
  let fixture: ComponentFixture<ConditionsDUtilisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionsDUtilisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionsDUtilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
