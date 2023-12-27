import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../crud.service';
import { Event } from '../crud.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-view-event-client',
  templateUrl: './view-event-client.page.html',
  styleUrls: ['./view-event-client.page.scss'],
})
export class ViewEventClientPage implements OnInit {

  eventName: string = '';
  event : Event = {} as Event;
  speakers : any[] = [];
  floorPlan : any;
  attendees : any[] = [];
  updates : any[] = [];
  userType : string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    public crudService : CrudService,
    public loadingController : LoadingController,
    public alertController : AlertController,
    public authService : AuthService,
    public navController : NavController,
  ) {

   }

  async ngOnInit() {
    this.authService.getUserData().then((user) => {
      this.userType = user.type;
    });
    this.eventName = this.activatedRoute.snapshot.paramMap.get('name') ?? '';
    this.getEventDetails();
  }

  async getEventDetails(){
    const loading = await this.loadingController.create({
      message: 'Loading event information...',
    });
    await loading.present();

    try{

      await this.crudService.getEventDetails(this.eventName).then((event) => { // Specify the type of 'event' as 'Event'
        console.log("Event details:");
        this.event = event as Event;
        console.log(this.event);
      });

      await this.getEventSpeakers();
      await this.getEventFloorPlan();
      await this.getEventAttendees();
      await this.getEventUpdates();

      loading.dismiss();
    } catch(err){
      let alert = await this.alertController.create({
        header: 'Error',
        message: 'Error getting event details, please try again later!',
        buttons: ['OK']
      });

      console.log("Error getting event details");
      loading.dismiss();
      alert.present();
    }
  }

  /** 
    Event Agenda done
    Speakers
    Exhibition/ Floor Plan
    Registration (for attendees)
    Attendees
    Updates
   */

  async getEventSpeakers(){
    this.speakers = await this.crudService.getEventSpeakers(this.event.name);
  }

  async getEventFloorPlan(){
    this.floorPlan = await this.crudService.getEventFloorPlan(this.event.hall_id);
  }

  async getEventAttendees(){
    this.attendees = await this.crudService.getEventAttendees(this.event.name);
  }

  async registerEvent(){
    let loading = await this.loadingController.create({
      message: "Registering for event...",
    });
    loading.present();

    const currentUser = this.authService.getCurrentUser();
    if(currentUser == null || currentUser == undefined){
      console.log("User not logged in");
      loading.dismiss();
      return;
    } else{
      // first check if the user is already registered
      let isRegistered = false;
      this.attendees.forEach((attendee) => {
        if(currentUser.displayName == attendee.name){
          isRegistered = true;
        }
      });

      if(isRegistered){
        loading.dismiss();

        let alert = await this.alertController.create({
          header: 'Failed',
          message: 'You are already registered for this event!',
          buttons: ['OK']
        });
        alert.present();
        return;
      }

      if(await this.crudService.registerAttendeeInEvent(this.event.name, currentUser?.uid)){
        loading.dismiss();

        let alert = await this.alertController.create({
          header: 'Success',
          message: 'Successfully registered for event!',
          buttons: ['OK']
        });
        alert.present();
        // getting new attendees list
        await this.getEventAttendees();
      } else{
        loading.dismiss();

        let alert = await this.alertController.create({
          header: 'Error',
          message: 'Error registering for event, please try again later!',
          buttons: ['OK']
        });
        alert.present();
      }
      
    }
    // console.log("user id to register: " + currentUser?.uid);
    loading.dismiss();
  }

  async refreshViewEventPage(event : any){
    await this.getEventDetails();

    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
  }

  async getEventUpdates(){
    this.updates = await this.crudService.getEventUpdates(this.event.name);
    console.log(this.updates);
  }

  backToTaps(){
    this.navController.navigateBack('/tabs');
  }

}
