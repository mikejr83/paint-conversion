import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintsUtilityFilterComponent } from './paints-utility-filter.component';

describe('PaintsUtilityFilterComponent', () => {
  let component: PaintsUtilityFilterComponent;
  let fixture: ComponentFixture<PaintsUtilityFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintsUtilityFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintsUtilityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
