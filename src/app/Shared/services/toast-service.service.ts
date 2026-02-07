import { inject, Inject, Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  messageService = inject(MessageService);
  translate = inject(TranslateService);

  constructor(private injector: Injector) {
    // 🧠 break DI loop
    this.messageService = this.injector.get(MessageService);
  }

  show(
    severity: 'success' | 'info' | 'warn' | 'error',
    detail?: string,
    summary?: string,
    life = 3000
  ) {
    const defaultSummary = 'COMMON.' + `${severity.toUpperCase()}_SUMMARY`;
    const defaultDetail = 'COMMON.' + `${severity.toUpperCase()}_DETAIL`;
    this.messageService.add({
      severity,
      summary: this.translate.instant(summary ?? defaultSummary),
      detail: this.translate.instant(detail ?? defaultDetail),
      life,
    });
  }

  clear() {
    this.messageService.clear();
  }
}
