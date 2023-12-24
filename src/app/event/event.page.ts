import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../crud.service';
import { Event } from '../crud.service';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  eventName: string = '';
  event : Event = {} as Event;
  speakers : any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public crudService : CrudService,
    public loadingController : LoadingController,
    public alertController : AlertController,
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
        loading.dismiss();
      });
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
  registerEvent(){
    
  }

}
