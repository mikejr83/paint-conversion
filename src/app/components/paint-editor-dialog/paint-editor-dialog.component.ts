import { PaintActions } from '@/app/store/actions/paint.actions';
import {
  selectSelectedPaint,
  selectSelectedPaintKey,
  selectSelectedPaintName,
} from '@/app/store/selectors/paint.selector';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-paint-editor-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './paint-editor-dialog.component.html',
  styleUrl: './paint-editor-dialog.component.scss',
})
export class PaintEditorDialogComponent {
  paintKey;
  paintName;
  formGroup;
  currentColor;

  dialogRef;
  constructor(
    private store: Store,
    formBuilder: FormBuilder,
  ) {
    this.paintKey = store.selectSignal(selectSelectedPaintKey);
    this.paintName = store.selectSignal(selectSelectedPaintName);
    this.dialogRef = inject(MatDialogRef);

    this.formGroup = formBuilder.group({
      name: ['', Validators.required],
      series: '',
      color: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^#[0-9a-fA-F]{6}$/),
        ]),
      ],
    });

    this.currentColor = toSignal(this.formGroup.get('color')!.valueChanges);

    store
      .select(selectSelectedPaint)
      .pipe(
        takeUntilDestroyed(),
        filter((paint) => !!paint),
      )
      .subscribe((paint) => {
        this.formGroup.patchValue(paint);
      });
  }

  async onCommit() {
    const formValue = this.formGroup.value;
    const selectedPaint = await firstValueFrom(
      this.store.select(selectSelectedPaint),
    );

    this.store.dispatch(
      PaintActions.updatePaint({
        paint: {
          ...selectedPaint!,
          name: formValue.name!,
          series: formValue.series!,
          color: formValue.color!,
        },
      }),
    );
    this.dialogRef.close();
  }
}
