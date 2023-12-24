// hall-edit-modal.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CrudService, Hall } from '../crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hall-edit-modal',
  templateUrl: './hall-edit-modal.page.html',
  styleUrls: ['./hall-edit-modal.page.scss'],
})
export class HallEditModalPage implements OnInit {
  editedHall: Hall = {} as Hall;
  editForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private crudService: CrudService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      booth_fitting: ['', Validators.required],
      capacity: ['', Validators.required],
      contact_info: ['', Validators.required],
      floor_plan: ['', Validators.required],
      // Add more form fields and validation rules as needed
    });
  }

  async updateHall() {
    try {
      console.log('Updating hall');

      if (this.editForm.valid) {
        // Use the CrudService to update the hall information
        await this.crudService.updateDocumentByQuery('halls', 'name', this.editedHall.name, this.editedHall);

        console.log('Hall updated successfully');

        // Dismiss the modal
        this.modalController.dismiss({ updatedHall: this.editedHall });
      } else {
        console.log('Form is invalid. Please check the fields.');
      }
    } catch (error) {
      console.error('Error updating hall:', error);
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    console.log('Edit HallModalPage initialized');
  }
}
