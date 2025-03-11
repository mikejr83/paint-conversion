import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintsUtilityComponent } from './paints-utility.component';

describe('PaintsUtilityComponent', () => {
  let component: PaintsUtilityComponent;
  let fixture: ComponentFixture<PaintsUtilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintsUtilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintsUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
