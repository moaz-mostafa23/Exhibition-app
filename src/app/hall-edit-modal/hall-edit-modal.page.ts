import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CrudService, Hall } from '../crud.service';
@Component({
  selector: 'app-hall-edit-modal',
  templateUrl: './hall-edit-modal.page.html',
  styleUrls: ['./hall-edit-modal.page.scss'],
})
export class HallEditModalPage implements OnInit {
  editedHall: Hall = {} as Hall;
  constructor(private modalController: ModalController, private crudService: CrudService) { }
  async updateHall() {
    try {
      // Use the CrudService to update the hall information
      await this.crudService.updateDocumentByQuery('halls', 'name', this.editedHall.name, this.editedHall);
      console.log('Hall updated successfully');
      // Dismiss the modal
      this.modalController.dismiss({ updatedHall: this.editedHall });
    } catch (error) {
      console.error('Error updating hall:', error);
    }
  }
  dismissModal() {
    this.modalController.dismiss();
  }
  ngOnInit() {
    console.log(' edit HallModalPage initialized');
  }
}