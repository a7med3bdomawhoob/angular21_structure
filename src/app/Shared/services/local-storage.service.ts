import { Injectable } from '@angular/core';
import { LOCALSTORAGE_ENUM } from '../enums/local-storage-enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {


     get(key: LOCALSTORAGE_ENUM): string | null {
    if (typeof window !== 'undefined') {   
      const value= localStorage.getItem(key);
       return value 
    }
    return null; // SSR fallback
  }

  set(key: LOCALSTORAGE_ENUM, value: any) {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  }




  // set(key: string, value: string): void {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem(key, value);
  //   }
  // }

  

  remove(key: LOCALSTORAGE_ENUM) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
