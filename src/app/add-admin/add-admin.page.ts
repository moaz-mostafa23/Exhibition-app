
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CrudService } from '../crud.service';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference } from '@angular/fire/firestore';
import { DocumentData } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.page.html',
  styleUrls: ['./add-admin.page.scss'],
})
export class AddAdminPage implements OnInit {

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
      map(users => users.filter(user => user.userType !== "admin"))
    );
    // this.users$.forEach(user => {
    //   console.log(user.filter(user => user.userType !== "admin"));
    // });
    
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async addAdmin(user: any) {
  try {

    await this.crudService.updateDocument('users', user.id, { userType: 'admin'});
  } catch (error) {
    console.error('Error adding admin:', error);
  }
}

}
