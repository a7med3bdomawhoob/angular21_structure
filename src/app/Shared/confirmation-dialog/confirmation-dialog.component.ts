
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { LAYOUT_DIRECTION_ENUM } from '../layout-direction-enum';
import { LanguageService } from '../services/language.service';
import { LANGUAGE_ENUM } from '../enums/language-enum';
import { ConfirmationDialogData } from '../confirmation-dialog-data';
import { DIALOG_ENUM } from '../dialog-enum';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [TranslatePipe],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  onConfirm(): void {
    this.dialogRef.close(DIALOG_ENUM.OK);
  }

  onCancel(): void {
    this.dialogRef.close(DIALOG_ENUM.CANCEL);
  }
}
