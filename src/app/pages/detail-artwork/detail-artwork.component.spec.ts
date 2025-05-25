import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArtworkComponent } from './detail-artwork.component';

describe('DetailArtworkComponent', () => {
  let component: DetailArtworkComponent;
  let fixture: ComponentFixture<DetailArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailArtworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
