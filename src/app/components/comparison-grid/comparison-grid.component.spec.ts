import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonGridComponent } from './comparison-grid.component';

describe('ComparisonGridComponent', () => {
  let component: ComparisonGridComponent;
  let fixture: ComponentFixture<ComparisonGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
