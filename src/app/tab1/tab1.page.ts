import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { User } from '../auth.service';
import {Auth, getAuth} from '@angular/fire/auth';
import { AuthService } from '../auth.service';
import { CrudService } from '../crud.service';
import { Event } from '../crud.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})

export class Tab1Page implements OnInit, OnDestroy {
  user: any;
  private auth: Auth | any;
  userType: string = '';

  events : Event[] = {} as Event[]; // this list will be updated and maintained along with the data
  // we will get from the observable. This will help us when filtering search results of the user.
  eventsCopy : Event[] = {} as Event[]; // this list will be used to store the original data from the observable.
  
  
  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    public crudService : CrudService,
    public alertController : AlertController,
    public utilityService : UtilityService,
  ) {
    

  }

  async ngOnInit() {
    this.authService.userLoggedIn.subscribe(async ()=>{
      const loading = await this.loadingController.create({
        message: 'Loading user information...',
      });
      await loading.present();
      try{
        const isLoggedIn = await this.authService.isLoggedIn();
        if(isLoggedIn){
          this.user = await this.authService.getUserData();
          loading.dismiss();
          this.userType = this.user.userType;
        }else{
          loading.dismiss();
          this.navCtrl.navigateForward('/login');
        }
      }catch(err){
        loading.dismiss();
        console.log(err);
      }
    });

    await this.getEvents();
  }


  ngOnDestroy(): void {
    // Unsubscribe from the userLoggedIn observable to avoid memory leaks
    this.authService.userLoggedIn.unsubscribe();
  }

  async getEvents(){
    const loading = await this.loadingController.create({
      message: 'Loading Events Information...',
    });
    await loading.present();

    try{
      this.crudService.getDocuments('events').subscribe((events)=>{
        this.events = events as Event[];
        this.eventsCopy = events as Event[];
      
        this.events.forEach(element => {
          element.start_date = this.utilityService.convertFirebaseTimestamp(element.start_date).toDateString() + "\t-\t" + this.utilityService.convertFirebaseTimestamp(element.start_date).toLocaleTimeString();
          element.end_date = this.utilityService.convertFirebaseTimestamp(element.end_date).toDateString() + "\t-\t" + this.utilityService.convertFirebaseTimestamp(element.end_date).toLocaleTimeString();
          // TODO: back to it later
          // element.hall_name = this.getHallName(element.hall_id);
        });

        // same for the eventsCopy
        this.eventsCopy.forEach(element => {
          element.start_date = this.utilityService.convertFirebaseTimestamp(element.start_date).toDateString() + "\t-\t" + this.utilityService.convertFirebaseTimestamp(element.start_date).toLocaleTimeString();
          element.end_date = this.utilityService.convertFirebaseTimestamp(element.end_date).toDateString() + "\t-\t" + this.utilityService.convertFirebaseTimestamp(element.end_date).toLocaleTimeString();
          // TODO: back to it later
          // element.hall_name = this.getHallName(element.hall_id);
        });

        console.log(this.events);
        loading.dismiss();
      });
    }catch(err){
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

  searchEvents(event: any){
    const searchTerm = event.target.value;
    if(searchTerm == ''){
      this.eventsCopy = this.events;
      return;
    }
    
    if(searchTerm && searchTerm.trim() != ''){
      this.eventsCopy = this.eventsCopy.filter((event)=>{
        return (event.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });
    }
  }
}
