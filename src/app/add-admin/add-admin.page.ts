
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, User } from '../auth.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CrudService } from '../crud.service';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference } from '@angular/fire/firestore';
import { DocumentData } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.page.html',
  styleUrls: ['./add-admin.page.scss'],
})

export class AddAdminPage implements OnInit {


  user:any;
  myForm: FormGroup;

  
// observable that will hold all users
  allUsers$: Observable<any[]> = of([]);
  // observable that will hold users that are not admins
  users$: Observable<any[]> = of([]);

  constructor(
    private authService: AuthService, 
    private loading:LoadingController, 
    private navCtrl:NavController, 
    private alertCtrl: AlertController,
    private crudService: CrudService,
    private auth: AuthService,
    private load: LoadingController
  ) { 
   this.myForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordValidator()]),
    confirmPassword: new FormControl('', [Validators.required, this.confirmPasswordValidator()]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, this.phoneValidator()]),
  });
}


async ngOnInit() {
   
  try {
    // fetch all users which are not admins
    this.allUsers$ = await this.crudService.getDocuments('users');
    this.users$ = this.allUsers$.pipe(
      map(users => users.filter(user => user.userType !== "admin"))
    );
    // this.users$.forEach(user => {
    //   console.log(user.filter(user => user.userType !== "admin"));
    // });
    
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
async back(){ 
   await this.navCtrl.navigateForward('/tabs/tab3');
} 


// async addAdmin(user: any) {
//   try {

//     await this.crudService.updateDocument('users', user.id, { userType: 'admin'});
//   } catch (error) {
//     console.error('Error adding admin:', error);
//   }
// }

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

const loader = await this.load.create({ message: 'Adding Admin...' });
try {
  loader.present();
  console.log(this.myForm.controls['password'].value);

  // Extract only relevant values from the form
  const registeredUser: User = {
    firstName: this.myForm.controls['firstName'].value,
    lastName: this.myForm.controls['lastName'].value,
    password: this.myForm.controls['password'].value,
    email: this.myForm.controls['email'].value,
    phone: this.myForm.controls['phone'].value,
    userType: "admin"
  };

  await this.auth.adminSignUp(registeredUser);
  await loader.dismiss();
  await this.navCtrl.navigateForward('/tabs');
} catch (err) {
  await loader.dismiss();
  console.log(err);
}
}

}



