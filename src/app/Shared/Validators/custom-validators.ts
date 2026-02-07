import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isValidValue } from '../utils/utils';

const defaultLengths = {
  MIN_LENGTH: 3,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 50,
  SHORT_NAME_MAX: 30,
  MIN_LENGTH_MESSAGE:20,
  ARABIC_NAME_MAX: 250,
  REGION_NAME_MAX: 100,
  MAIL_SESCRIPTION: 1000,
  NAME_MAX: 100,
  ENGLISH_NAME_MAX: 250,
  NOTES: 2000,
  EMAIL_MAX: 200,
  PHONE_NUMBER_MAX: 15,
  ADDRESS_MAX: 1000,
  QID_MIN: 11,
  QID_MAX: 11,
  SWIFT_CODE_MIN: 8,
  SWIFT_CODE_MAX: 11,
  NUMBERS_MAXLENGTH: 4,
  DECIMAL_PLACES: 2,
  EXPLANATIONS: 1333,
  _500: 500,
  INT_MAX: 2_147_483_647,
  MIN_NUM_1_9: 1,
  DESC: 4000,
};

export function pattern(patternName: customValidationTypes): ValidatorFn {
  if (!patternName || !validationPatterns.hasOwnProperty(patternName)) {
    return Validators.nullValidator;
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }
    const response: object = {};
    // @ts-ignore
    response[patternName] = true;
    return !validationPatterns[patternName].test(control.value) ? response : null;
  };
}

export type customValidationTypes =
  | 'ENG_NUM'
  | 'AR_NUM'
  | 'ENG_ONLY'
  | 'AR_ONLY'
  | 'ENG_NUM_ONLY'
  | 'AR_NUM_ONLY'
  | 'ENG_NUM_ONE_ENG'
  | 'AR_NUM_ONE_AR'
  | 'ENG_AR_ONLY'
  | 'ENG_AR_NUM_ONLY'
  | 'ENG_NO_SPACES_ONLY'
  | 'PASSPORT'
  | 'EMAIL'
  | 'NUM_HYPHEN_COMMA'
  | 'PHONE_NUMBER'
  | 'WEBSITE'
  | 'URL'
  | 'HAS_LETTERS'
  | 'PASSWORD'
  | 'SAUDI_NUMBER'
  | 'MIN_NUM_1_9'
  | 'INVALID_URL'
  | 'NUM_ONLY_WITH_DOT';

export const validationPatterns: any = {
  ENG_NUM: new RegExp(/^[^\u0600-\u06FF]+$/),
  AR_NUM: new RegExp(/^[^A-Za-z]+$/),
  ENG_ONLY: new RegExp(/^[a-zA-Z ]+$/),
  AR_ONLY: new RegExp(/^[\u0621-\u064A ]+$/),
  ENG_NUM_ONLY: new RegExp(/^[a-zA-Z0-9]+$/),
  AR_NUM_ONLY: new RegExp(/^[\u0621-\u064A0-9\u0660-\u0669]+$/),
  ENG_NUM_ONE_ENG: new RegExp(/^(?=.*[a-zA-Z])([a-zA-Z0-9\- ]+)$/),
  AR_NUM_ONE_AR: new RegExp(/^(?=.*[\u0621-\u064A])([\u0621-\u064A0-9\u0660-\u0669\- ]+)$/),
  ENG_AR_ONLY: new RegExp(/^[a-zA-Z\u0621-\u064A ]+$/),
  ENG_AR_NUM_ONLY: new RegExp(/^[a-zA-Z\u0621-\u064A0-9\u0660-\u0669 ]+$/),
  ENG_NO_SPACES_ONLY: new RegExp(/^[a-zA-Z]+$/),
  PASSPORT: new RegExp('^[A-Z][0-9]{8,}$'),
  INVALID_URL: new RegExp(/^(?=.{1,2083}$)(https?|ftp):\/\/[A-Za-z0-9._~\/?#%=&:-]+$/),

  // EMAIL: new RegExp(
  //   /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/
  // ),
  EMAIL: new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  NUM_HYPHEN_COMMA: new RegExp('^(?=.*?[1-9])[0-9-,._]+$'),
  // PHONE_NUMBER: new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$','gmi')
  PHONE_NUMBER: new RegExp(/^[+]?[0-9]+$/),
  WEBSITE: new RegExp(
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_=]+=[a-zA-Z0-9-%]+&?)?$/
  ),
  URL: new RegExp(
    'https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}'
  ),
  HAS_LETTERS: new RegExp(
    /^[\u0621-\u064A0-9\u0660-\u0669\u0621-\u064Aa-zA-Z0-9]*[\u0621-\u064Aa-zA-Z ]/
  ),
  // PASSWORD: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,}$'),
  PASSWORD: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*]).{7,}$'),

  SAUDI_NUMBER: new RegExp('^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$'),
  MIN_NUM_1_9: new RegExp('^[1-9]\\d*$'),
  NUM_ONLY_WITH_DOT: new RegExp('^\\d+(\\.\\d+)?$'),
};

export function timeFromBeforeTimeTo(fromKey: string, toKey: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const fromControl = form.get(fromKey);
    const toControl = form.get(toKey);

    if (!fromControl?.value || !toControl?.value) return null;

    const from = new Date(fromControl.value);
    const to = new Date(toControl.value);

    from.setSeconds(0, 0);
    to.setSeconds(0, 0);

    return from >= to ? { timeFromAfterTimeTo: true } : null;
  };
}

export const CustomValidators = {
  defaultLengths,
  pattern,
  maxDigitsValidator,
};

export const completeRangeValidator: ValidatorFn = (
  control: AbstractControl): ValidationErrors | null => {
    const v = control.value as Date[] | null;
    if (!v || v.length === 0) return null;
    const [from, to] = v;
    return from && to ? null : { rangeIncomplete: true };
};
export function maxDigitsValidator(maxDigits: number = 4): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value == null || value === '') return null;

    const digitsOnly = value.toString().replace(/\D/g, '');
    return digitsOnly.length > maxDigits ? { maxDigits: { required: maxDigits, actual: digitsOnly.length } } : null;
  };
}
