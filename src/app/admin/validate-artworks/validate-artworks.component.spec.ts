import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateArtworksComponent } from './validate-artworks.component';

describe('ValidateArtworksComponent', () => {
  let component: ValidateArtworksComponent;
  let fixture: ComponentFixture<ValidateArtworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateArtworksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateArtworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
