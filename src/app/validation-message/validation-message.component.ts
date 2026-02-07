import { Component, EnvironmentInjector, inject, input, OnInit, runInInjectionContext } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { debounceTime, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { ValidationErrorKeyEnum } from '../Shared/enums/validation-error-key-enum';
@Component({
  selector: 'app-validation-messages',
  imports: [TranslatePipe, AsyncPipe],
  standalone: true,
  templateUrl: './validation-message.component.html',
  styleUrl: './validation-message.component.scss',
})
export class ValidationMessagesComponent implements OnInit {
  control = input.required<AbstractControl>();
  activeErrors$!: Observable<{ key: string; value: any }[]>;
  errorKey = ValidationErrorKeyEnum;
  translateService = inject(TranslateService);
  private env = inject(EnvironmentInjector);
  ngOnInit(): void {
   runInInjectionContext(this.env, () => {
      this.activeErrors$ = toObservable(this.control).pipe(
        switchMap((ctrl) =>
          merge(of(null), ctrl.statusChanges).pipe(
            startWith(null),
            debounceTime(100),
            map(() => {
              const errors = ctrl.errors ?? {};
              return Object.entries(errors).map(([key, value]) => ({ key, value }));
            })
          )
        )
      );
    });
  }

  getMessage(key: string): string | null {
    const message = this.validationMessages[key as ValidationErrorKeyEnum];

    if (!message) return null;

    // Handle dynamic messages with parameters
    const error = this.control().errors?.[key];
    if (error && typeof error === 'object') {
      return this.formatMessage(this.translateService.instant(message), error);
    }

    return message;
  }

  private formatMessage(message: string, errorData: any): string {
    // Handle maxlength and minlength with dynamic values
    if (errorData.requiredLength !== undefined) {
      return message.replace('{length}', errorData.requiredLength.toString());
    }

    // Handle number range validation
    if (errorData.min !== undefined && errorData.max !== undefined) {
      return message
        .replace('{min}', errorData.min.toString())
        .replace('{max}', errorData.max.toString());
    }

    return message;
  }

  validationMessages: Record<ValidationErrorKeyEnum, string> = {
    [ValidationErrorKeyEnum.REQUIRED]: 'COMMON.REQUIRED_FIELD',
    [ValidationErrorKeyEnum.AR_NUM]: 'COMMON.ARABIC_ONLY',
    [ValidationErrorKeyEnum.ENG_NUM]: 'COMMON.ENGLISH_ONLY',
    [ValidationErrorKeyEnum.MIN_LENGTH]: 'COMMON.MIN_LENGTH',
    [ValidationErrorKeyEnum.MAX_LENGTH]: 'COMMON_ERROR_VALIDATION_INPUT.MAX_LENGTH',
    [ValidationErrorKeyEnum.START_AFTER_END]: 'COMMON.START_BEFORE_END',
    [ValidationErrorKeyEnum.TIME_FROM_AFTER_TIME_TO]: 'COMMON.TIME_FROM_BEFORE_TIME_TO',
    [ValidationErrorKeyEnum.EMAIL]: 'COMMON_ERROR_VALIDATION_INPUT.EMAIL_VALIDATION',
    [ValidationErrorKeyEnum.STRONG_PASSWORD]: 'COMMON.STRONG_PASSWORD',
    [ValidationErrorKeyEnum.NATIONAL_ID]: 'COMMON.NATIONAL_ID_VALIDATION',
    [ValidationErrorKeyEnum.PHONE_NUMBER]: 'COMMON.PHONE_NUMBER_VALIDATION',
    [ValidationErrorKeyEnum.POSITIVE_NUMBER]: 'COMMON.POSITIVE_NUMBER_ONLY',
    [ValidationErrorKeyEnum.INVALID_NUMBER]: 'COMMON.INVALID_NUMBER',
    [ValidationErrorKeyEnum.NUMBER_RANGE]: 'COMMON.NUMBER_RANGE',
    [ValidationErrorKeyEnum.PASSWORD]: 'COMMON.PASSWORD_VALID',
    [ValidationErrorKeyEnum.SAUDI_NUMBER]: 'COMMON.SAUDI_NUMBER',
    [ValidationErrorKeyEnum.EXPERATION_DATE_AFTER_START_DATE]:
      'COMMON_ERROR_VALIDATION_INPUT.EXPERATION_DATE_AFTER_START_DATE',
    [ValidationErrorKeyEnum.MIN_NUM_1_9]: 'COMMON_ERROR_VALIDATION_INPUT.MIN_NUM_1_9',
    [ValidationErrorKeyEnum.INVALID_URL]: 'COMMON.INVALID_URL'  
  };
}
