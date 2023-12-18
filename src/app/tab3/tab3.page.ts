import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

  user:any;

  constructor(private authService: AuthService, private loading:LoadingController, private navCtrl:NavController, private alertCtrl: AlertController) {}


  async  ngOnInit() {
    this.authService.userLoggedIn.subscribe(async ()=>{
    const loader = await this.loading.create({message: 'Loading...'});
    loader.present();
    try{
    const isLoggedIn =  await this.authService.isLoggedIn();
    if(!isLoggedIn) this.navCtrl.navigateForward('/login');
    this.user = await this.authService.getUserData();
    await loader.dismiss();
    }catch(err){
      loader.dismiss();
    }
  });

  }

  async signOut(){
    const loader = await this.loading.create({
      message: "Signing Out..."
    });
    loader.present();
    try{
      await this.authService.signout();
      await this.authService.isLoggedIn();
      await this.navCtrl.navigateForward("/login");
      await loader.dismiss();
    }catch(err){
      loader.dismiss();
      console.log(err);

    }
  }


  async deleteAccount(){
    const alert = await this.alertCtrl.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete your account? There is no going back.',
      buttons: [
        {
          text:'Cancel',
          role:'cancel'
        },
        {
          text:'Delete',
          handler: async ()=>{
            const loader = this.loading.create({message: 'Loading...'});
            (await loader).present();
            try{
            await this.authService.deleteUserAccount();
            await this.authService.isLoggedIn();
            (await loader).dismiss();
            await this.navCtrl.navigateForward("/login");
            }catch(err){
              (await loader).dismiss();
              console.log(err);
            }
          }
        }
      ]
    });

    await alert.present();

  }


  ngOnDestroy(): void {
    this.authService.userLoggedIn.unsubscribe();
}
// route to edit profile page
     viewEdit(){
        this.navCtrl.navigateForward("/edit-profile");
               }

      viewAddAdmin(){
        this.navCtrl.navigateForward("/add-admin");
               }


}
