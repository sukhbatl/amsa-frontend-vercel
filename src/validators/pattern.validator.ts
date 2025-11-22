import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function patternValidator(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === '') {
      return { 'patternInvalid': { regexp } };
    }
    return regexp.test(value) ? null : { 'patternInvalid': { regexp } };
  };
}
