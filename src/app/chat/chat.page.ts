import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../crud.service';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  receiverId : any = '';
  msg = '';
  constructor(private activatedRoute : ActivatedRoute, 
              private crudService : CrudService, 
              private authService : AuthService,
              private alertController : AlertController,
              ) { }

  ngOnInit() {
    this.receiverId = this.activatedRoute.snapshot.paramMap.get('receiverId');
  }

  async sendMessage(){
    let currentUserId = this.authService.getCurrentUser()?.uid;
    if(
      !this.crudService.sendMessage(currentUserId, this.receiverId, this.msg)
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
