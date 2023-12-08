import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage  {
  myForm: FormGroup;
  
 

  constructor() {
    this.myForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, this.phoneValidator()]),
    
  
userType: new FormControl('', [Validators.required]),
    });

   }

  

  passwordValidator(){
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return !regex.test(password) ? { invalidPassword: true} : null;
  };
}

// Email validator function
emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;
    const regex = /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+)(\.[a-zA-Z0-9-]+)+$/;
    return !regex.test(email) ? { invalidEmail: true } : null;
  };
}

// Phone number validator function
phoneValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const phone = control.value;
    const regex = /^\+?[1-9]\d{1,14}$/;
    return !regex.test(phone) ? { invalidPhone: true } : null;
  };
}

// Functions to check for invalid inputs
passwordInvalid() {
  return this.myForm.controls['password'].invalid && (this.myForm.controls['password'].dirty || this.myForm.controls['password'].touched);
}

emailInvalid() {
  return this.myForm.controls['email'].invalid && (this.myForm.controls['email'].dirty || this.myForm.controls['email'].touched);
}


phoneInvalid() {
  return this.myForm.controls['phone'].invalid && (this.myForm.controls['phone'].dirty || this.myForm.controls['phone'].touched);

}
onSubmit() {
  if (this.myForm.invalid) {
    console.error('Form is invalid:', this.myForm.errors);
    return;
  }

  console.log(this.myForm.value);
}




}
