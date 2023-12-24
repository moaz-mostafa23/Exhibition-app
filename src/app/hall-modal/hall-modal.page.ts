// hall-modal.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CrudService } from '../crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hall-modal',
  templateUrl: './hall-modal.page.html',
  styleUrls: ['./hall-modal.page.scss'],
})
export class HallModalPage implements OnInit {
  hallForm: FormGroup;
  hall = {
    booth_fitting: '',
    capacity: '',
    contact_info: '',
    floor_plan: '',
    name: '',
  };

  constructor(
    private modalController: ModalController,
    private crudService: CrudService,
    private formBuilder: FormBuilder
  ) {
    this.hallForm = this.formBuilder.group({
      booth_fitting: ['', Validators.required],
      capacity: ['', Validators.required],
      contact_info: ['', Validators.required],
      floor_plan: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  submitForm() {
    try {
      console.log('Form submitted');
      if (this.hallForm.valid) {
        // Proceed with form submission
        this.crudService.createDocument('halls', this.hallForm.value);
        this.dismissModal();
      } else {
        console.log('Form is invalid. Please check the fields.');
      }
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
