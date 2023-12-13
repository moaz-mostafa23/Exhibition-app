import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  user:any;

  constructor(private authService:AuthService, private loading:LoadingController, private navCtrl: NavController) {
    
  }

  async  ngOnInit() {
    this.authService.userLoggedIn.subscribe(async ()=>{
    const loader = await this.loading.create({message: 'Loading...'});
    loader.present();
    try{
    const isLoggedIn =await this.authService.isLoggedIn();
    if(!isLoggedIn) this.navCtrl.navigateForward('/login');
    this.user = await this.authService.getUserData();
    await loader.dismiss();
    }catch(err){
      loader.dismiss();
    }
  }
)};

ngOnDestroy(): void {
    this.authService.userLoggedIn.unsubscribe();
}

}
