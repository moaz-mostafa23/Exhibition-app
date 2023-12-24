import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService, Hall } from '../crud.service';
import { NavController } from '@ionic/angular';
import { UtilityService } from '../utility.service';
// import { Chart } from 'chart.js';


@Component({
  selector: 'app-hall',
  templateUrl: './hall.page.html',
  styleUrls: ['./hall.page.scss'],
  styles: [`
    ion-content {
      background-color: #f0f0f0;
    }

    h2 {
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    th, td {
      padding: 12px;
      text-align: left;
      border: 1px solid #ddd;
    }

    th {
      background-color: #4CAF50;
      color: white;
    }
  `],
})
export class HallPage implements OnInit {
  hall: Hall = {} as Hall;
  hallName: string = '';
  hallId: string | null = '';
  events: any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public crudService: CrudService,
    public utilityService: UtilityService,
  ) { }

  async ngOnInit() {
    this.hallName = this.activatedRoute.snapshot.paramMap.get('name') ?? '';
    this.hallId = await this.getHallId(this.hallName);
    await this.loadHallData();
    await this.loadReservationHistory();
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
      console.error('Error getting hall data:', error);
    }
  }

  async deleteHall(hallName: string) {
    try {
      await this.crudService.deleteDocumentByQuery('halls', 'name', hallName);
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  }

  async getReservationHistory(hallId: string) {
    try {
      const reservationHistory = await this.crudService.getDocumentsByQuery('events', 'hall_id', hallId);
      console.log('Reservation history:', reservationHistory)
      return reservationHistory;
    } catch (error) {
      console.error('Error getting reservation history:', error);
      throw error;
    }
  }

  async getHallId(hallName: string) {
    try {
      const hallId = await this.crudService.getDocumentIdByUniqueKey('halls', 'name', hallName);
      return hallId;
    } catch (error) {
      console.error('Error getting hall ID:', error);
      throw error;
    }
  }

  async loadReservationHistory() {
    try {
      const reservationHistory = await this.getReservationHistory(this.hallId as string);
      this.events = reservationHistory as Event[];
      // Format timestamps to human-readable dates
      this.events.forEach(event => {
        event.start_date = this.utilityService.convertFirebaseTimestamp(event.start_date);
        event.end_date = this.utilityService.convertFirebaseTimestamp(event.end_date);
      });
      console.log('Reservation history:', this.events);
    } catch (error) {
      console.error('Error loading reservation history:', error);
    }
  }



}
