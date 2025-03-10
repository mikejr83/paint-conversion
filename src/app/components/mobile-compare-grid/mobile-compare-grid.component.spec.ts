import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCompareGridComponent } from './mobile-compare-grid.component';

describe('MobileCompareGridComponent', () => {
  let component: MobileCompareGridComponent;
  let fixture: ComponentFixture<MobileCompareGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCompareGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCompareGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
