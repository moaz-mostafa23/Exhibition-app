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

  convertFirebaseTimestamp(timestamp: any): string {
    let date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds / 1000000));
    return date.toDateString() + "\t-\t" + date.toLocaleTimeString();
  }

}
