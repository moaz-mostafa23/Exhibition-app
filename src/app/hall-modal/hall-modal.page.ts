// hall-modal.page.ts

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-hall-modal',
  templateUrl: './hall-modal.page.html',
  styleUrls: ['./hall-modal.page.scss'],
})
export class HallModalPage implements OnInit {
  hall = {
    booth_fitting: '',
    capacity: '',
    contact_info: '',
    floor_plan: '',
    name: '',
  };

  constructor(private modalController: ModalController, private crudService: CrudService) { }


  submitForm() {
    try {
      console.log('Form submitted');
      // TODO: Add code to submit form (add to db)
      this.crudService.createDocument('halls', this.hall);
      this.dismissModal();
    } catch (error) {
      console.error('Error submitting form', error);
    }
  }


  dismissModal() {
    try {
      console.log('Dismissing Modal');
      this.modalController.dismiss();
      console.log('Modal dismissed');
    } catch (error) {
      console.error('Error dismissing Modal', error);
    }
  }

  ngOnInit() {
    console.log('HallModalPage initialized');
  }


}
