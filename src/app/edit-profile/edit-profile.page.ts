import { Component, OnInit } from '@angular/core';
import { User } from '../auth.service';
import {Auth, getAuth} from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  user: any;
  private auth: Auth | any;

  constructor( 
    private authService: AuthService,
    private loadingController: LoadingController,
    private navCtrl: NavController,) { }

  async ngOnInit() {
    this.authService.userLoggedIn.subscribe( async ()=>{
      const loading = await this.loadingController.create({
        message: 'Loading user information...',
      });
      await loading.present();
      try{
        const isLoggedIn = await this.authService.isLoggedIn();
        if(isLoggedIn){
          this.user = await this.authService.getUserData();
          loading.dismiss();
        }else{
          loading.dismiss();
         await this.navCtrl.navigateForward('/login');
        }
      }catch(err){
        loading.dismiss();
        console.log(err);
      }
}
);
  }
  async updateProfile(){
    const loading = await this.loadingController.create({
      message: 'Updating profile...',
    });
    await loading.present();
    try{
      await this.authService.updateProfile(this.user);
      await loading.dismiss();
      await this.navCtrl.navigateForward('/tabs');
    }catch(err){
      loading.dismiss();
      console.log(err);
    }
  }
 async back(){
    await this.navCtrl.navigateForward('/tabs/tab3');
  }
  
  // ngOnDestroy(): void {
  //   // Unsubscribe from the userLoggedIn observable to avoid memory leaks
  //   this.authService.userLoggedIn.unsubscribe();
  // }
}
