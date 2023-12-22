import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService, Hall } from '../crud.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.page.html',
  styleUrls: ['./hall.page.scss'],
})
export class HallPage implements OnInit {
  hall: Hall = {} as Hall;
  hallName: string = '';
  constructor(public activatedRoute: ActivatedRoute, private navCtrl: NavController, public crudService: CrudService) { }

  async ngOnInit() {
    this.hallName = this.activatedRoute.snapshot.paramMap.get('name') ?? '';
    await this.loadHallData();
  }

  async loadHallData() {
    try {
      const hallData = await this.crudService.getDocumentByQuery('halls', 'name', this.hallName);

      if (hallData) {
        this.hall = hallData as Hall;
        console.log('Hall data:', this.hall);
      } else {
        console.log('Hall data not found');
      }
    } catch (error) {
      console.error("Error getting hall data: ", error);
    }
  }

  async deleteHall(hallName: string) {
    try {
      // Call your CRUD service to delete the hall by its ID
      await this.crudService.deleteDocumentByQuery('halls', 'name', hallName);
      // Redirect the user to the home page
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  }


}
