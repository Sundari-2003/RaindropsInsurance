import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exploreallplans } from './exploreallplans';

describe('Exploreallplans', () => {
  let component: Exploreallplans;
  let fixture: ComponentFixture<Exploreallplans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exploreallplans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exploreallplans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
