import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService, Message } from '../crud.service';
import { AuthService } from '../auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, DocumentReference, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentData, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  eventId : any = '';
  msg = '';
  currentUserId = this.authService.getCurrentUser()?.uid;


  messages$ : Observable<Message[]> = undefined as any;

  constructor(private activatedRoute : ActivatedRoute, 
              private crudService : CrudService, 
              private authService : AuthService,
              private alertController : AlertController,
              private toastController : ToastController,
              ) { }

  async ngOnInit() {
    this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId');
    // subscribe to the messages observable
    this.messages$ = await this.crudService.getMessages(this.eventId);
    console.log(this.messages$);
  }

  async sendMessage(){
    if(this.msg.trim() === ''){
      return;
    }

    if(
      !this.crudService.sendMessage(this.currentUserId, this.eventId, this.msg) // if the message is not sent
      ){
        console.log("Error sending message");

        let toast = await this.toastController.create({
          message: 'Error sending message, please try again later!',
          duration: 2000,
          position: 'bottom',
          color: 'danger',
        });

        toast.present();
        // let alert = await this.alertController.create({
        //   header: 'Error',
        //   message: 'Error sending message, please try again later!',
        //   buttons: ['OK']
        // });
        // alert.present();
      }
    this.msg = '';
  }



}
