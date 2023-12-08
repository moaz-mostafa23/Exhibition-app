import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
}




export interface User {
  first_name:string,
  last_name:string,
  email:string,
  password:string,
  phone:string,
  user_type:string

}
