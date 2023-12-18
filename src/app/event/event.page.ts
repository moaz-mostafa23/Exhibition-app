import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  eventName: string = '';

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.eventName = this.activatedRoute.snapshot.paramMap.get('name') ?? '';
  }

}
