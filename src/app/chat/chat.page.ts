import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../crud.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  receiverId : any = '';
  msg = '';
  constructor(private activatedRoute : ActivatedRoute, private crudService : CrudService, private authService : AuthService,) { }

  ngOnInit() {
    this.receiverId = this.activatedRoute.snapshot.paramMap.get('receiverId');
  }

  sendMessage(){
    let currentUserId = this.authService.getCurrentUser()?.uid;
    this.crudService.sendMessage(currentUserId, this.receiverId, this.msg);
    this.msg = '';
  }



}
