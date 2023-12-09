import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService, User } from '../auth.service';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage  {
  myForm: FormGroup;
  
 

  constructor(private auth: AuthService, private load: LoadingController, private navCtrl: NavController) {
    this.myForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required, this.confirmPasswordValidator()]),
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
confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!this.myForm) {
      return null;
    }
    const passwordControl = this.myForm.get('password');
    if (!passwordControl || !control.value) {
      return null;
    }

    return passwordControl.value === control.value ? null : { passwordsDoNotMatch: true };
  };
}




confirmPasswordInvalid() {
  return this.myForm.controls['confirmPassword'].invalid && (this.myForm.controls['confirmPassword'].dirty || this.myForm.controls['confirmPassword'].touched);
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
async onSubmit() {
  if (this.myForm.invalid) {
    console.error('Form is invalid:', this.myForm.errors);
    return;
  }

  const loader = await this.load.create({ message: 'Signing up...' });
  try {
    loader.present();

    // Extract only relevant values from the form
    const registeredUser: User = {
      firstName: this.myForm.controls['firstName'].value,
      lastName: this.myForm.controls['lastName'].value,
      password: this.myForm.controls['password'].value,
      email: this.myForm.controls['email'].value,
      phone: this.myForm.controls['phone'].value,
      userType: this.myForm.controls['userType'].value
    };

    await this.auth.signUp(registeredUser);
    await loader.dismiss();
    this.navCtrl.navigateForward('/login');
  } catch (err) {
    await loader.dismiss();
    console.log(err);
  }
}




}
