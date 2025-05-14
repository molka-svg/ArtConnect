import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeuvresEnAttenteComponent } from './oeuvres-en-attente.component';

describe('OeuvresEnAttenteComponent', () => {
  let component: OeuvresEnAttenteComponent;
  let fixture: ComponentFixture<OeuvresEnAttenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OeuvresEnAttenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OeuvresEnAttenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
