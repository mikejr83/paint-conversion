import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintEditorDialogComponent } from './paint-editor-dialog.component';

describe('PaintEditorDialogComponent', () => {
  let component: PaintEditorDialogComponent;
  let fixture: ComponentFixture<PaintEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintEditorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
