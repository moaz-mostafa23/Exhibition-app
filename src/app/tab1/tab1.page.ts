import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, NavController, ModalController, ActionSheetController } from '@ionic/angular';
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
  selectedDate= new Date();
  sortOption: 'none' | 'asc' | 'desc' = 'none';
  minCapacity: number = 0;
  maxCapacity: number = 3000; // Set this to the maximum capacity of your halls





  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    public crudService: CrudService,
    public alertController: AlertController,
    public utilityService: UtilityService,
    public navController: NavController,
    private modalController: ModalController,
    private actionSheet: ActionSheetController
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

            await this.filterHalls('all');

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


  async presentActionSheet(){
    const action = await this.actionSheet.create({
      header: 'Filter',
      buttons: [{
        text: 'Reserved',
        handler: async () => {
          const loading = await this.loadingController.create({
            message: 'Please wait...',
          });
          await loading.present();
          await this.filterHalls('reserved');
          await loading.dismiss();
        }
      }, {
        text: 'Available',
        handler: async () => {
          const loading = await this.loadingController.create({
            message: 'Please wait...',
          });
          await loading.present();
          await this.filterHalls('available');
          await loading.dismiss();
        }
      }, {
        text: 'All',
        handler: async () => {
          const loading = await this.loadingController.create({
            message: 'Please wait...',
          });
          await loading.present();
          await this.filterHalls('all');
          await loading.dismiss();
        }
      }]
    });
  
    await action.present();
  }
  

  async filterHalls(option: any) {

    let hallsPromises = this.halls.map(async (hall: any) => {
      let events = await this.crudService.getEventsByHallID(hall.id);
      let isReserved = events.some((event: any) =>
        event.status === 'approved' &&
        this.isDateInRange(this.selectedDate, event.start_date.toDate(), event.end_date.toDate())
      );
  
      if (option === 'reserved' && isReserved) {
        return hall;
      } else if (option === 'available' && !isReserved) {
        return hall;
      } else if (option === 'all') {
        return hall;
      }
    });
  
    this.hallsCopy = (await Promise.all(hallsPromises)).filter(hall => hall !== undefined);
    
  }
  

  isDateInRange(date:Date, startDate:Date, endDate:Date) {
    let d = new Date(date);
    let start = new Date(startDate);
    let end = new Date(endDate);
  
    // Set the time on the dates to be the same, so we're only comparing the date part
    d.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  
    return d >= start && d <= end;
  }

  sortByCapacity(order: 'asc' | 'desc') {
    this.hallsCopy.sort((a:any, b:any) => {
      if (order === 'asc') {
        return a.capacity - b.capacity;
      } else {
        return b.capacity - a.capacity;
      }
    });
  }
  sortChange() {
    if (this.sortOption === 'asc') {
      this.sortByCapacity('asc');
    } else if (this.sortOption === 'desc') {
      this.sortByCapacity('desc');
    } else {
      this.resetSort();
    }
  }
  
  

  resetSort() {
    this.hallsCopy = [...this.halls];
  }

  filterByCapacity() {
    this.hallsCopy = this.halls.filter((hall:any) => hall.capacity >= this.minCapacity && hall.capacity <= this.maxCapacity);
  }
  
  


}
