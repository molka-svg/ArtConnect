import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementsEnAttenteComponent } from './evenements-en-attente.component';

describe('EvenementsEnAttenteComponent', () => {
  let component: EvenementsEnAttenteComponent;
  let fixture: ComponentFixture<EvenementsEnAttenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvenementsEnAttenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvenementsEnAttenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
