import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  textToBase64(text: string): string {
    return btoa(unescape(encodeURIComponent(text)));
  }
  
  base64ToText(base64: string): string {
    return decodeURIComponent(escape(atob(base64)));
  }



}
