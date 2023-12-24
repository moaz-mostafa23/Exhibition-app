import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService, Message } from '../crud.service';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
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

  receiverId : any = '';
  msg = '';
  currentUserId = this.authService.getCurrentUser()?.uid;


  messages$ : Observable<Message[]> = undefined as any;

  constructor(private activatedRoute : ActivatedRoute, 
              private crudService : CrudService, 
              private authService : AuthService,
              private alertController : AlertController,
              ) { }

  async ngOnInit() {
    this.receiverId = this.activatedRoute.snapshot.paramMap.get('receiverId');
    // subscribe to the messages observable
    this.messages$ = await this.crudService.getMessages(this.currentUserId, this.receiverId);
  }

  async sendMessage(){
    if(this.msg.trim() === ''){
      return;
    }

    if(
      !this.crudService.sendMessage(this.currentUserId, this.receiverId, this.msg)
      ){
        console.log("Error sending message");
        let alert = await this.alertController.create({
          header: 'Error',
          message: 'Error sending message, please try again later!',
          buttons: ['OK']
        });
        alert.present();
      }
    this.msg = '';
  }



}
