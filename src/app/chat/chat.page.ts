import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  receiverId : any = '';
  constructor(private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.receiverId = this.activatedRoute.snapshot.paramMap.get('receiverId');
  }

  

}
