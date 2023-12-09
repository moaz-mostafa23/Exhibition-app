import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from '../auth.service';
import {Auth, getAuth} from '@angular/fire/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  user: User | any;
  private auth: Auth | any;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private navCtrl: NavController
  ) {}

  async getUser() {
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      return await this.authService.getUserByUid(currentUser.uid);
    } else {
      return null;
    }
  }

  async ngOnInit() {
    this.auth = getAuth();

    this.authService.userLoggedIn.subscribe(async (loggedIn) => {
      const loading = await this.loadingController.create({
        message: 'Loading user information...',
      });
      await loading.present();

      try {
        const user = await this.getUser();
        if (!loggedIn || !user) {
          this.navCtrl.navigateForward('/login');
        } else {
          console.log(user);
          this.user = user;
        }
      } catch (err) {
        console.error(err);
      } finally {
        await loading.dismiss();
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the userLoggedIn observable to avoid memory leaks
    this.authService.userLoggedIn.unsubscribe();
  }
}
