import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { User } from '../auth.service';
import { Auth, getAuth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { HallModalPage } from '../hall-modal/hall-modal.page';
import { CrudService } from '../crud.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  user: any;
  halls: any
  private auth: Auth | any;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private modalController: ModalController,
    private CrudService: CrudService
  ) { }


  async ngOnInit() {
    this.authService.userLoggedIn.subscribe(async () => {
      const loading = await this.loadingController.create({
        message: 'Loading user information...',
      });
      await loading.present();
      try {
        const isLoggedIn = await this.authService.isLoggedIn();
        if (isLoggedIn) {
          this.user = await this.authService.getUserData();
          const documents$ = this.CrudService.getDocuments('halls'); // Update to halls
          this.halls = await firstValueFrom(documents$);

          console.log('halls', this.halls);

          loading.dismiss();
        } else {
          loading.dismiss();
          this.navCtrl.navigateForward('/login');
        }
      } catch (err) {
        loading.dismiss();
        console.log(err);
      }


    });

  }
  ngOnDestroy(): void {
    // Unsubscribe from the userLoggedIn observable to avoid memory leaks
    this.authService.userLoggedIn.unsubscribe();
  }


  async openHallModal() {
    try {
      console.log('Opening Hall Modal');
      const modal = await this.modalController.create({
        component: HallModalPage,
      });
      console.log('Modal created');
      await modal.present();
      console.log('Modal presented');
    } catch (error) {
      console.error('Error opening Hall Modal', error);
    }
  }

  async deleteHall(hallId: string) {
    try {
      // Call your CRUD service to delete the hall by its ID
      await this.CrudService.deleteDocument('halls', hallId);
      // Optionally, update the local halls array to reflect the deletion immediately
      this.halls = this.halls.filter((hall: { id: string; }) => hall.id !== hallId);
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  }


}
