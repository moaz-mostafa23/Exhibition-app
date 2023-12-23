import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CrudService } from '../crud.service';
import { firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';




@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {
  eventForm: FormGroup;
  halls = [];
  hallObjs:any = [] ;
  user:any = {};
  updateHeader:any = '';

  constructor(private loadingCtrl: LoadingController,private storage:Storage,private crud:CrudService,private modalCtrl: ModalController, private formBuilder:FormBuilder, private alrtCtrl:AlertController) {
    
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      agenda: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      pic1: ['', Validators.required],
      pic2: ['', Validators.required],
      status: ['pending'],
      updateHeader: ['', Validators.required],
      speakerName: ['', Validators.required],
      hallName: ['', Validators.required],
      updates: ['', Validators.required]
    });
  
    
  }


  async submit(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();
  
    const clientId = await this.crud.getDocumentIdByUniqueKey('users','uid',this.user.uid);
    const selectedHalldocID:any = await this.crud.getDocumentIdByUniqueKey('halls','name', this.eventForm.controls['hallName'].value);
    const selectedHallOBJ  = await this.crud.getDocumentById('halls',selectedHalldocID);
    const isReserved:any = await this.crud.isEventReserved(this.eventForm.controls['startDate'].value, this.eventForm.controls['endDate'].value, selectedHalldocID);
    if (isReserved === 'Reserved'){
      const alert = await this.alrtCtrl.create({
        header: 'Error',
        message: 'Reserved',
        buttons: ['Ok']
      });
      await loading.dismiss();
      return alert.present();
    }
    const newEvent = {
      name: this.eventForm.controls['eventName'].value,
      agenda: this.eventForm.controls['agenda'].value,
      start_date: firebase.firestore.Timestamp.fromDate(new Date(this.eventForm.controls['startDate'].value)),
      end_date: firebase.firestore.Timestamp.fromDate(new Date(this.eventForm.controls['endDate'].value)),
      hall_id: selectedHalldocID,
      client_id: clientId,
      picture: [this.eventForm.controls['pic1'].value, this.eventForm.controls['pic2'].value],
      status: this.eventForm.controls['status'].value
    };
    const eventDocRef = await this.crud.createDocument('events', newEvent);
  
    // Create a new speaker
    const newSpeaker = {
      event_id: eventDocRef.id,
      speaker_name: this.eventForm.controls['speakerName'].value
    };
    await this.crud.createDocument('speakers', newSpeaker);
  
    // Create a new update
    const newUpdate = {
      event_id: eventDocRef.id,
      update_header: this.eventForm.controls['updateHeader'].value,
      update_text: this.eventForm.controls['updates'].value
    };
    await this.crud.createDocument('updates', newUpdate);
  
    await loading.dismiss();
    await this.modalCtrl.dismiss();
  }
  
    

  

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

 async ngOnInit() {
  this.user = await this.storage.get('UserData');
  const halls$ = this.crud.getDocuments<any>('halls');
  this.hallObjs = await firstValueFrom(halls$);
  this.halls = this.hallObjs.map((res:any)=> {return res.name});


  }

}
