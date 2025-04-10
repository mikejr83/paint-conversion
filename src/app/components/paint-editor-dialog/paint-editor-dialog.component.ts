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
  selectedPaint;

  dialogRef;
  constructor(
    private store: Store,
    formBuilder: FormBuilder,
  ) {
    this.dialogRef = inject(MatDialogRef);

    this.paintKey = store.selectSignal(selectSelectedPaintKey);
    this.paintName = store.selectSignal(selectSelectedPaintName);
    // An observable of the selected paint. This makes sure that any
    // subscription gets a selected paint and not null or undefined.
    const selectedPaint$ = store.select(selectSelectedPaint).pipe(
      takeUntilDestroyed(),
      filter((paint) => !!paint),
    );

    // Define the form group for the dialog.
    this.formGroup = formBuilder.group({
      name: ['', Validators.required],
      key: ['', Validators.required],
      series: '',
      color: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^#[0-9a-fA-F]{6}$/),
        ]),
      ],
    });

    // Create a signal from the color control's value changing.
    // This will enable the view to "watch" the currently selected color.
    this.currentColor = toSignal(this.formGroup.get('color')!.valueChanges);

    // Always make the key upper case and remove any non-word characters.
    this.formGroup
      .get('name')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .pipe(filter(() => this.formGroup.get('key')?.untouched ?? false))
      .subscribe((name) => {
        this.formGroup.patchValue({
          key: name,
        });
      });
    this.formGroup
      .get('key')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((key) => {
        this.formGroup.patchValue(
          {
            key: key?.toLocaleUpperCase().replace(/\s|\W+/g, '_'),
          },
          {
            emitEvent: false,
          },
        );
      });

    // Patch the form's value when the selected paint changes.
    selectedPaint$.subscribe((paint) => {
      this.formGroup.patchValue(paint);
    });

    //
    this.selectedPaint = toSignal(selectedPaint$);
  }

  onRemove() {
    this.store.dispatch(
      PaintActions.removePaint({
        paint: this.selectedPaint()!,
      }),
    );
    this.dialogRef.close();
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
          key: formValue.key!,
        },
      }),
    );
    this.dialogRef.close();
  }
}
