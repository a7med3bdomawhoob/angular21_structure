import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogRef } from '@angular/cdk/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { LAYOUT_DIRECTION_ENUM } from '../layout-direction-enum';
import { LanguageService } from '../services/language.service';
import { LANGUAGE_ENUM } from '../enums/language-enum';
import { AlertDialogData } from '../alert-dialog-data';

@Component({
  selector: 'app-alert-dialog',
  imports: [TranslatePipe],  //npm install @ngx-translate/core
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertDialogData) {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  get iconPath(): string {
    switch (this.data.icon) {
      case 'success':
        return '/assets/icons/checkmark.svg';
      case 'error':
        return '/assets/icons/error.svg';
      case 'info':
        return '/assets/icons/info.svg';
      case 'warning':
        return '/assets/icons/warning.svg';
      default:
        return '';
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 2000); // 1 second = 1000 ms
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
