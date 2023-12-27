import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { CrudService } from '../crud.service';
import { CalendarComponent } from 'ionic2-calendar';

@Component({
  selector: 'app-foresee',
  templateUrl: './foresee.page.html',
  styleUrls: ['./foresee.page.scss'],
})
export class ForeseePage implements OnInit {
  hallID:any;
  eventsOfHall:any;
  eventSource:any = [];
  viewTitle: string | any;
  selectedDate: Date = new Date();

  @ViewChild(CalendarComponent) myCal!:CalendarComponent;

  constructor(private modalCtrl:ModalController, private navParams:NavParams, private crud:CrudService, private loading:LoadingController) {

    this.hallID = navParams.get('hallID');
   }

  async ngOnInit() {
    const loader = await this.loading.create({message: 'loading...'});
    loader.present();
    try{
    this.eventsOfHall = (await this.crud.getEventsByHallID(this.hallID)).filter((val:any)=>{return val.status === 'approved'});
    this.eventsOfHall.forEach((event:any) => {
      this.eventSource.push({
        title: event.name,
        startTime: new Date(event.start_date.toDate()),
        endTime: new Date(event.end_date.toDate()),
        allDay: false
      });
    });

    // Refresh the calendar
    this.myCal.loadEvents();
    await loader.dismiss();
  }catch(err){
    loader.dismiss();
    console.log(err)
  }
  }

  onCurrentDateChanged(event:any){
    console.log(event)
  }
  onViewTitleChanged(title:any){
    this.viewTitle = title;
  }

  onTimeSelected(event:any){
    console.log('TIme selected', event
    )

  }

  onEventSelected(event:any){}

  

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
