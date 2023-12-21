import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  user:any;
  registeredEventsID:any;
  registeredEventsObj:any;
  

  constructor(private crud:CrudService,private authService:AuthService, private loading:LoadingController, private navCtrl: NavController, private alertController:AlertController) {
    
  }

  async  ngOnInit() {
    this.authService.userLoggedIn.subscribe(async ()=>{
    const loader = await this.loading.create({message: 'Loading...'});
    loader.present();
    try{
    const isLoggedIn =await this.authService.isLoggedIn();
    if(!isLoggedIn) this.navCtrl.navigateForward('/login');
    this.user = await this.authService.getUserData();
    const docID:any= await this.crud.getDocumentIdByUniqueKey('users','email',this.user.email);
    this.registeredEventsID = (await this.crud.getRegisteredEventsByAttendeeId(docID)).map((res:any)=> res.event_id);
    this.registeredEventsObj = await this.crud.getEventsByIds(this.registeredEventsID);
    console.log(this.registeredEventsObj);
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
          const attendeeID:any = await this.crud.getDocumentIdByUniqueKey('users','email',this.user.email);
          await this.crud.deleteRegisteredEvent(eventID, attendeeID);

          await loading.dismiss();
          console.log('Event deleted successfully');
          await this.ngOnInit();
        }
      }
    ]
  });

  await alert.present();
}

}
