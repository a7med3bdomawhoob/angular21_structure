import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicDate'
})
export class ArabicDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    const convertToArabicDigits = (str: string): string => {
      const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
      return str.replace(/\d/g, d => arabicDigits[+d]);
    };

    const formatted = `${day}/${month}/${year}`;
    return convertToArabicDigits(formatted);
  }
}
