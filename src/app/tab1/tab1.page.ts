import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { User } from '../auth.service';
import { Auth, getAuth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { CrudService } from '../crud.service';
import { Event, Hall } from '../crud.service';
import { UtilityService } from '../utility.service';
import { HallModalPage } from '../hall-modal/hall-modal.page';
import { firstValueFrom } from 'rxjs';
import { HallEditModalPage } from '../hall-edit-modal/hall-edit-modal.page';
import { ForeseePage } from '../foresee/foresee.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})

export class Tab1Page implements OnInit, OnDestroy {
  user: any;
  private auth: Auth | any;
  userType: string = '';

  events: Event[] = [] as Event[]; // this list will be updated and maintained along with the data
  // we will get from the observable. This will help us when filtering search results of the user.
  eventsCopy: Event[] = [] as Event[]; // this list will be used to store the original data from the observable.

  halls: Hall[] = {} as Hall[];
  hallsCopy: Hall[] = {} as Hall[];



  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    public crudService: CrudService,
    public alertController: AlertController,
    public utilityService: UtilityService,
    public navController: NavController,
    private modalController: ModalController,
  ) {


  }

  async ngOnInit() {
    this.authService.userLoggedIn.subscribe(async () => {
      const loading = await this.loadingController.create({
        message: 'Loading Home page...',
      });
      await loading.present();
      try {
        const isLoggedIn = await this.authService.isLoggedIn();
        if (isLoggedIn) {
          this.user = await this.authService.getUserData();
          // const documents$ = this.crudService.getDocuments('halls'); // Update to halls
          // this.halls = await firstValueFrom(documents$);

          console.log('halls', this.halls);

          loading.dismiss();
          this.userType = this.user.userType;

          // loading user's home page data
          if (this.userType == 'client' || this.userType == 'admin')
            await this.getHalls();
          else if (this.userType == 'attendee')
            await this.getEvents();

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

  async getEvents() {
    const loading = await this.loadingController.create({
      message: 'Loading Events Information...',
    });
    await loading.present();

    try {
      this.events = await this.crudService.getAttendeeHomeEvents();
      this.eventsCopy = this.events;
      console.log(this.events);
      loading.dismiss();
    } catch (err) {
      let alert = await this.alertController.create({
        header: 'Error',
        message: 'There was an error loading the events. Please try again later.',
        buttons: ['OK']
      });
      loading.dismiss();
      alert.present();
      console.log(err);
    }
  }

  async handleAttendeeHomeRefresh(event : any){
    await this.getEvents();

    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
  }

  async handleClientHomeRefresh(event : any){
    await this.getHalls();

    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
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

  async deleteHall(hallName: string) {
    try {
      // Call your CRUD service to delete the hall by its ID
      await this.crudService.deleteDocumentByQuery('halls', 'name', hallName);
      // Optionally, update the local halls array to reflect the deletion immediately
      this.halls = this.halls.filter((hall) => hall.name !== hallName);
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  }




  async getHalls() {
    const loading = await this.loadingController.create({
      message: 'Loading Halls Information...',
    });
    await loading.present();

    try {
      this.crudService.getDocuments('halls').subscribe((halls) => {
        this.halls = halls as Hall[];
        this.hallsCopy = halls as Hall[];

        // this.halls.forEach(element => {
        //   element.start_date = this.utilityService.convertFirebaseTimestamp(element.start_date);
        //   element.end_date = this.utilityService.convertFirebaseTimestamp(element.end_date); 
        // });

        // // same for the eventsCopy
        // this.hallsCopy.forEach(element => {
        //   element.start_date = this.utilityService.convertFirebaseTimestamp(element.start_date);
        //   element.end_date = this.utilityService.convertFirebaseTimestamp(element.end_date); 
        // });

        console.log("Halls:")
        console.log(this.halls);
        loading.dismiss();
      });
    } catch (err) {
      let alert = await this.alertController.create({
        header: 'Error',
        message: 'There was an error loading the halls. Please try again later.',
        buttons: ['OK']
      });
      loading.dismiss();
      alert.present();
      console.log(err);
    }
  }

  searchEvents(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm == '') {
      this.eventsCopy = this.events;
      return;
    }

    if (searchTerm && searchTerm.trim() != '') {
      this.eventsCopy = this.eventsCopy.filter((event) => {
        return (event.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });
    }
  }

  searchHalls(hall: any) {
    const searchTerm = hall.target.value;
    if (searchTerm == '') {
      this.hallsCopy = this.halls;
      return;
    }

    if (searchTerm && searchTerm.trim() != '') {
      this.hallsCopy = this.hallsCopy.filter((hall) => {
        return (hall.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });
    }
  }
  async editHall(hall: Hall) {
    try {
      const modal = await this.modalController.create({
        component: HallEditModalPage,
        componentProps: { editedHall: hall },
      });

      await modal.present();

      // Wait for the modal to be dismissed
      const { data } = await modal.onDidDismiss();

      // Check if any data was returned from the modal (e.g., updated hall)
      if (data && data.updatedHall) {
        // Perform any necessary actions based on the returned data
        console.log('Hall updated:', data.updatedHall);

        // Optionally, update the local halls array to reflect the changes
        const updatedHallIndex = this.halls.findIndex((h) => h.name === data.updatedHall.name);
        if (updatedHallIndex !== -1) {
          this.halls[updatedHallIndex] = data.updatedHall;
        }
      }
    } catch (error) {
      console.error('Error opening Hall Edit Modal', error);
    }
  }

  async openForesee(hallName:any){
    const hallDocID = await this.crudService.getDocumentIdByUniqueKey('halls','name',hallName);
    const modal = await this.modalController.create({
      component: ForeseePage,
      componentProps:{
        'hallID': hallDocID
      }
    });
    return await modal.present();



  }
}
