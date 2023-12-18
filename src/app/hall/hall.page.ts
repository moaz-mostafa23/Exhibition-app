import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.page.html',
  styleUrls: ['./hall.page.scss'],
})
export class HallPage implements OnInit {

  hallName: string = '';
  constructor(public activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.hallName = this.activatedRoute.snapshot.paramMap.get('name') ?? '';
  } 

}
