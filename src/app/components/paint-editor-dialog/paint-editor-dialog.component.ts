import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { PaintActions } from '@/app/store/actions/paint.actions';
import { Paint } from '@/models/paint';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { selectAllPaints } from '@/app/store/selectors/paint.selector';

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
export class PaintEditorDialogComponent implements AfterViewInit {
  allPaints;

  isNew;
  paintKey;
  paintName;
  formGroup;
  currentColor;

  providedPaint;

  dialogRef;
  constructor(
    private store: Store,
    formBuilder: FormBuilder,
  ) {
    this.dialogRef = inject(MatDialogRef<PaintEditorDialogComponent>);
    const providedPaint = inject(MAT_DIALOG_DATA) as Paint & { isNew: boolean };

    this.providedPaint = signal<Paint>(providedPaint);
    this.isNew = signal<boolean>(providedPaint.isNew);
    this.paintKey = signal<string>(providedPaint.key);
    this.paintName = signal<string>(providedPaint.name);

    this.allPaints = store.selectSignal(selectAllPaints);

    // Define the form group for the dialog.
    this.formGroup = formBuilder.group({
      name: ['', Validators.required],
      key: [
        '',
        Validators.compose([
          Validators.required,
          uniqueKeyValidator(this.allPaints()),
        ]),
      ],
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
    this.currentColor = toSignal(this.formGroup.get('color')!.valueChanges, {
      initialValue: providedPaint.color,
    });

    // Always make the key upper case and remove any non-word characters.
    this.formGroup
      .get('name')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .pipe(
        filter(
          () =>
            (this.formGroup.get('key') &&
              this.formGroup.get('key')?.enabled &&
              this.formGroup.get('key')?.untouched &&
              this.formGroup.get('name')?.touched) ??
            false,
        ),
      )
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
  }
  ngAfterViewInit(): void {
    const providedPaint = this.providedPaint();
    this.formGroup.patchValue(providedPaint);
    this.formGroup.get('key')?.updateValueAndValidity();
  }

  onRemove() {
    this.store.dispatch(
      PaintActions.removePaint({
        paint: this.providedPaint(),
      }),
    );
    this.dialogRef.close();
  }

  async onCommit() {
    const formValue = this.formGroup.value;
    const selectedPaint = this.providedPaint();

    const paint = {
      ...selectedPaint!,
      name: formValue.name!,
      series: formValue.series!,
      color: formValue.color!,
      key: formValue.key!,
    };

    if (this.isNew()) {
      this.store.dispatch(
        PaintActions.addPaint({
          paint,
          selected: true,
        }),
      );
    } else {
      this.store.dispatch(
        PaintActions.updatePaint({
          paint,
        }),
      );
    }
    this.dialogRef.close();
  }
}

function uniqueKeyValidator(existingPaints: Paint[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const key = control.value;
    const isUnique = existingPaints.every((paint) => paint.key !== key);
    return isUnique ? null : { uniqueKey: { value: key } };
  };
}
