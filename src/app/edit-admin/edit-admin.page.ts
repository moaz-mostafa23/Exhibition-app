import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CrudService } from '../crud.service';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference } from '@angular/fire/firestore';
import { DocumentData } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.page.html',
  styleUrls: ['./edit-admin.page.scss'],
})
export class EditAdminPage implements OnInit {

  user:any;
  

  
// observable that will hold all users
  allUsers$: Observable<any[]> = of([]);
  // observable that will hold users that are not admins
  users$: Observable<any[]> = of([]);



  constructor(
    private authService: AuthService, 
    private loading:LoadingController, 
    private navCtrl:NavController, 
    private alertCtrl: AlertController,
    private crudService: CrudService
  ) { 
}


async ngOnInit() {
  try {
    // fetch all users which are not admins
    this.allUsers$ = await this.crudService.getDocuments('users');
    this.users$ = this.allUsers$.pipe(
      map(users => users.filter(user => user.userType === "admin"))
    );
    // this.users$.forEach(user => {
    //   console.log(user.filter(user => user.userType !== "admin"));
    // });
    
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async editAdmin(user: any) {
  try {
    // show verification message
    const alert1 = await this.alertCtrl.create({
      header: 'Verification',
      message: 'Are you sure you want to update this admin informations?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: async () => {
            // Display loading spinner
            const loading = await this.loading.create({
             message: 'Updating user...',
           });
           await loading.present();
 
           try {
             // Update user
             this.crudService.updateDocument('users', user.id, user)
           } catch (error) {
             console.error('Error Updating admin:', error);
           } finally {
             // Dismiss loading spinner
             await loading.dismiss();
           }
 
           // show success message
           const alert2 = await this.alertCtrl.create({
             header: 'Success',
             message: 'User Updated successfully',
             buttons: ['OK']
           });
 
           // Display alert2
           await alert2.present();
         }
       }
     ]
   });
 
   // show verification message
   await alert1.present();

  } catch (error) {
    console.error('Error updating admin:', error);
  }
}

async deleteAdmin(user: any) {
  try {
    // delete user
   
    // show verification message
    const alert1 = await this.alertCtrl.create({
      header: 'Verification',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler:async () => {
           // Display loading spinner
           const loading = await this.loading.create({
            message: 'Deleting user...',
          });
          await loading.present();

          try {
            // Delete user
            await this.crudService.deleteDocument('users', user.id);
          } catch (error) {
            console.error('Error deleting admin:', error);
          } finally {
            // Dismiss loading spinner
            await loading.dismiss();
          }

          // show success message
          const alert2 = await this.alertCtrl.create({
            header: 'Success',
            message: 'User deleted successfully',
            buttons: ['OK']
          });

          // Display alert2
          await alert2.present();
        }
      }
    ]
  });

  // show verification message
  await alert1.present();
  } catch (error) {
    console.error('Error deleting admin:', error);
  }}


}
  
  

