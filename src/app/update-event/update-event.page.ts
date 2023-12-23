import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { CrudService } from '../crud.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.page.html',
  styleUrls: ['./update-event.page.scss'],
})
export class UpdateEventPage implements OnInit {
  eventID:any;
  eventObj:any;
  start_date:Date = new Date();
  end_date:Date = new Date();
  name:string = ''
  agenda:string = ''
  update_text:string = ''
  update_header:string = ""
  speaker_name:string = ""

  constructor(private modal:ModalController,private formBuilder: FormBuilder, private crud: CrudService, navParams: NavParams, private alertController: AlertController, private loadingController: LoadingController) { 
    this.eventID = navParams.get('eventID');
   
  }

  async ngOnInit() {
    const loader = await this.loadingController.create({message: 'loading...'});
    loader.present();
    this.eventObj = await this.crud.getDocumentById('events', this.eventID);
  
    // Get the updates document
    const updatesDoc:any = await this.crud.getDocumentByQuery('updates', 'event_id', this.eventID);
  
    // Get the speakers document
    const speakersDoc:any = await this.crud.getDocumentByQuery('speakers', 'event_id', this.eventID);
  
    // Create the form
    // this.updateForm = this.formBuilder.group({
    //   dummy: [''],
    //   update_text: [updatesDoc ? updatesDoc['update_text'] : ''],
    //   update_header: [updatesDoc ? updatesDoc['update_header'] : ''],
    //   speaker_name: [speakersDoc ? speakersDoc['speaker_name'] : '']
    // });
    this.update_text = updatesDoc['update_text'];
    this.update_header = updatesDoc['update_header'];
    this.speaker_name = speakersDoc['speaker_name']


  
    loader.dismiss();
  }


  isValid(){
    if(this.name && this.agenda && this.update_header && this.update_text && this.speaker_name){
      return true
    }else{
      return false;
    }
  }
  

  async onSubmit() {
    if (this.isValid()) {
      const formData = {
        name: this.name,
        start_date: firebase.firestore.Timestamp.fromDate(new Date(this.start_date)),
        end_date: firebase.firestore.Timestamp.fromDate(new Date(this.end_date)),
        agenda: this.agenda
      };
  
      console.log('Form data:', formData);
  
      const existingEventId = await this.crud.getDocumentIdByUniqueKey('events', 'name', formData.name);
      if (existingEventId && existingEventId !== this.eventID) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'An event with this name already exists.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
  
      const loading = await this.loadingController.create({
        message: 'Updating event...'
      });
      await loading.present();
  
      try {
        await this.crud.updateDocument('events', this.eventID, formData);
        console.log('Event document updated');
  
        const updatesData = {
          update_text: this.update_text,
          update_header: this.update_header
        };
        const updatesDoc:any = await this.crud.getDocumentByQuery('updates', 'event_id', this.eventID);
        const updatesID:any = await this.crud.getDocumentIdByUniqueKey('updates','event_id',this.eventID);
        if (updatesDoc && updatesID) {
          await this.crud.updateDocument('updates', updatesID, updatesData);
          console.log('Updates document updated');
        } else {
          console.log('Updates document not found or id is undefined');
        }
  
        const speakersData = {
          speaker_name: this.speaker_name
        };
        const speakersDoc = await this.crud.getDocumentByQuery('speakers', 'event_id', this.eventID);
        const speakerID = await this.crud.getDocumentIdByUniqueKey('speakers','event_id',this.eventID);
        if (speakersDoc && speakerID) {
          await this.crud.updateDocument('speakers', speakerID, speakersData);
          console.log('Speakers document updated');
        } else {
          console.log('Speakers document not found or id is undefined');
        }
  
        await loading.dismiss();
        await this.modal.dismiss();
      } catch (error) {
        console.error("Error updating event: ", error);
        await loading.dismiss();
      }
    }else{
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'The inputs are invalid.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  
  

  
  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modal.dismiss(null, 'confirm');
  }
}
