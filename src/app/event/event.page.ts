import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../crud.service';
import { Event } from '../crud.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  eventName: string = '';
  event : Event = {} as Event;
  speakers : any[] = [];
  floorPlan : any;
  attendees : any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public crudService : CrudService,
    public loadingController : LoadingController,
    public alertController : AlertController,
    public authService : AuthService,
  ) { }

  ngOnInit() {
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
    if(currentUser == null){
      console.log("User not logged in");
      loading.dismiss();
      return;
    } else{
      if(await this.crudService.registerAttendeeInEvent(this.event.name, currentUser?.uid)){
        loading.dismiss();

        let alert = await this.alertController.create({
          header: 'Success',
          message: 'Successfully registered for event!',
          buttons: ['OK']
        });
        alert.present();
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

}
