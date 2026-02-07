
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../confirmation-dialog-data';


@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  matDialog = inject(MatDialog);   //npm install @angular/material

  open(
    params: { icon?: string; messages?: string[]; confirmText?: string; cancelText?: string },
    dialogSize?: {
      width: string;
      maxWidth: string;
    }
  ) {
    return this.matDialog.open(ConfirmationDialogComponent, {
      width: dialogSize?.width || '100%',
      maxWidth: dialogSize?.maxWidth || '600px',
      data: <ConfirmationDialogData>{
        icon: params.icon || 'warning',
        messages: params.messages || ['COMMON.CONFIRM_DELETE'],
        confirmText: params.confirmText || 'COMMON.OK',
        cancelText: params.cancelText || 'COMMON.CANCEL',
      },
    });
  }
}
