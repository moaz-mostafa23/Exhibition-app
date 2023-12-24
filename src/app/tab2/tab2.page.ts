import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { CrudService } from '../crud.service';
import { CreateEventPage } from '../create-event/create-event.page';
import { UpdateEventPage } from '../update-event/update-event.page';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  user:any = {};
  registeredEventsID:any;
  registeredEventsObj:any;
  createdEvents:any = [];
  userID:any;
  AllEvents:any = [];
  pendingEvents:any = [];
  approvedEvents:any = [];
  notApprovedEvents:any = [];
  

  constructor(private modal:ModalController,private crud:CrudService,private authService:AuthService, private loading:LoadingController, private navCtrl: NavController, private alertController:AlertController) {
    
  }

  async  ngOnInit() {
    this.authService.userLoggedIn.subscribe(async ()=>{
    const loader = await this.loading.create({message: 'Loading...'});
    loader.present();
    try{
    const isLoggedIn =await this.authService.isLoggedIn();
    if(!isLoggedIn) this.navCtrl.navigateForward('/login');
    this.AllEvents = await this.crud.getAllDocumentsByCollectionUsingPromise('events');
    this.pendingEvents = this.AllEvents.filter((ev:any)=>{return ev.status === 'pending'});
    this.approvedEvents = this.AllEvents.filter((ev:any)=> {return ev.status === 'approved'});
    this.notApprovedEvents = this.AllEvents.filter((ev:any)=> {return ev.status === 'not approved'});
    this.user = await this.authService.getUserData();
    this.userID= await this.crud.getDocumentIdByUniqueKey('users','email',this.user.email);
    this.registeredEventsID = (await this.crud.getRegisterationByAttendeeId(this.userID)).map((res:any)=> res.event_id);
    this.registeredEventsObj = await this.crud.getEventsByIds(this.registeredEventsID);
    if(this.user.userType === 'client'){
    this.createdEvents = await this.crud.getEventsByClientId(this.userID);
    }
    console.log('All Events', this.AllEvents);
    console.log('Pending Events', this.pendingEvents);
    console.log('Approved Events',this.approvedEvents);
    console.log('Not Approved Events',this.notApprovedEvents);
    await loader.dismiss();
    }catch(err){
      loader.dismiss();
    }
  }
)};

ngOnDestroy(): void {
    this.authService.userLoggedIn.unsubscribe();
}

async deleteRegisteredEvent(name:string) {
  const alert = await this.alertController.create({
    header: 'Confirm!',
    message: 'Are you sure you want to delete this event?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('User cancelled the deletion');
        }
      }, {
        text: 'Yes',
        handler: async () => {
          const loading = await this.loading.create({
            message: 'Deleting...',
          });
          await loading.present();

          // Assuming you have a deleteRegisteredEvent function in your CrudService
          const eventID:any= await this.crud.getDocumentIdByUniqueKey('events','name',name);
          await this.crud.deleteRegisteration(eventID, this.userID);

          await loading.dismiss();
          console.log('Event deleted successfully');
          await this.ngOnInit();
        }
      }
    ]
  });

  await alert.present();
}


async customEvent(){
  const modal = await this.modal.create({
    component: CreateEventPage
  });
  modal.onDidDismiss().then(async()=>{await this.ngOnInit()})
  return await modal.present();
}

async deleteEvent(eventName: string): Promise<void> {
  try {
    // Get the event document ID by its unique key 'name'
    const eventDocId = await this.crud.getDocumentIdByUniqueKey('events', 'name', eventName);

    if (eventDocId) {
      // Create an alert controller
      const alert = await this.alertController.create({
        header: 'Confirm',
        message: 'Are you sure you want to delete this event?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Delete cancelled');
            }
          },
          {
            text: 'Delete',
            handler: async () => {
              // Create a loading controller
              const loading = await this.loading.create({
                message: 'Deleting event...'
              });
              loading.present();

              // Delete the event document
              await this.crud.deleteDocument('events', eventDocId);

              // Delete associated registrations, speakers, and updates
              await this.crud.deleteDocumentByQuery('registrations', 'event_id', eventDocId);
              await this.crud.deleteDocumentByQuery('speakers', 'event_id', eventDocId);
              await this.crud.deleteDocumentByQuery('updates', 'event_id', eventDocId);

              console.log('Event and associated documents deleted successfully');
              loading.dismiss();
              await this.ngOnInit();
            }
          }
        ]
      });

      // Present the alert
      await alert.present();
    } else {
      console.log('No event found with the specified name');
    }
  } catch (error) {
    console.error("Error deleting event: ", error);
  }
}

doReorderClient(ev: any) {
  // The `ev` event contains the new order of the accordions.
  // You can use this to update your `createdEvents` array.
  console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

  // Perform the array manipulation
  const itemMove = this.createdEvents.splice(ev.detail.from, 1)[0];
  this.createdEvents.splice(ev.detail.to, 0, itemMove)

  // After you've done the reordering, you must call `ev.detail.complete()`.
  ev.detail.complete();
}

doReorderAttendee(ev:any){
  console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

  // Perform the array manipulation
  const itemMove = this.registeredEventsObj.splice(ev.detail.from, 1)[0];
  this.registeredEventsObj.splice(ev.detail.to, 0, itemMove)

  // After you've done the reordering, you must call `ev.detail.complete()`.
  ev.detail.complete();
}

doReorderAdmin(ev: any) {
  console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

  const itemMove = this.AllEvents.splice(ev.detail.from, 1)[0];
  this.AllEvents.splice(ev.detail.to, 0, itemMove)

  ev.detail.complete();
}


async updateEvent(eventName:any){
  const eventID = await this.crud.getDocumentIdByUniqueKey('events', 'name',eventName);
  const modal = await this.modal.create({
    component: UpdateEventPage,
    componentProps: {
      'eventID' : eventID
    }
  });
  modal.onDidDismiss().then(async()=>{await this.ngOnInit()})
  return await modal.present();
}

async approveEvent(eventName:any){
  const loader = await this.loading.create({message: 'loading...'});
  loader.present();
  const eventDocID:any = await this.crud.getDocumentIdByUniqueKey('events','name',eventName);
  const eventObj = await this.crud.getDocumentById('events',eventDocID);
  if(eventObj.status === 'approved'){
    loader.dismiss();
    const alert = await this.alertController.create({header: 'Already Approved', buttons: ['Ok']});
    return alert.present();
  }
  try{
    await this.crud.updateDocument('events',eventDocID, {status: 'approved'});
    await loader.dismiss();
    await this.ngOnInit();
  }catch(err){
    loader.dismiss();
    console.log(err);
  }

}

async disproveEvent(eventName:any){
  const loader = await this.loading.create({message: 'loading...'});
  loader.present();
  const eventDocID:any = await this.crud.getDocumentIdByUniqueKey('events','name',eventName);
  const eventObj = await this.crud.getDocumentById('events',eventDocID);
  if(eventObj.status === 'not approved'){
    loader.dismiss();
    const alert = await this.alertController.create({header: 'Already Not Approved', buttons: ['Ok']});
    return alert.present();
  }
  try{
    await this.crud.updateDocument('events',eventDocID, {status: 'not approved'});
    await loader.dismiss();
    await this.ngOnInit();
  }catch(err){
    loader.dismiss();
    console.log(err);
  }


}






}
