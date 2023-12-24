import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService, Hall } from '../crud.service';
import { NavController } from '@ionic/angular';
import { UtilityService } from '../utility.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.page.html',
  styleUrls: ['./hall.page.scss'],
  styles: [
    `
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

      th,
      td {
        padding: 12px;
        text-align: left;
        border: 1px solid #ddd;
      }

      th {
        background-color: #4caf50;
        color: white;
      }
    `,
  ],
})
export class HallPage implements OnInit {
  hall: Hall = {} as Hall;
  hallName: string = '';
  hallId: string | null = '';
  events: any[] = [];
  showTable = false;
  selectedOption: string = 'last7days'; // Default option is last 7 days

  constructor(
    public activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public crudService: CrudService,
    public utilityService: UtilityService,
    private router: Router,
    private location: Location
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

      // Reload the current route to reflect changes
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      });
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  }

  async getReservationHistory(hallId: string) {
    try {
      const reservationHistory = await this.crudService.getDocumentsByQuery('events', 'hall_id', hallId);
      console.log('Reservation history:', reservationHistory);
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

      // Filter reservation history based on the selected option
      const currentDate = new Date();
      const startDateFilter = new Date();

      if (this.selectedOption === 'last7days') {
        startDateFilter.setDate(currentDate.getDate() - 7);
      } else if (this.selectedOption === 'last30days') {
        startDateFilter.setDate(currentDate.getDate() - 30);
      }

      this.events = reservationHistory.filter((event) => {
        // Check if 'start_date' property exists and is not undefined
        if (event && event['start_date']) {
          const eventStartDate = new Date(this.utilityService.convertTimestamp(event['start_date']));
          const dateDifference: number = (currentDate.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24);

          // Check if the event is within the selected time range
          return dateDifference <= (this.selectedOption === 'last7days' ? 7 : 30);
        }
        return false; // If 'start_date' is undefined, exclude the event
      });

      // Format timestamps to human-readable dates
      this.events.forEach((event) => {
        event['start_date'] = this.utilityService.convertFirebaseTimestamp(event['start_date']);
        event['end_date'] = this.utilityService.convertFirebaseTimestamp(event['end_date']);
      });

      console.log('Reservation history:', this.events);
    } catch (error) {
      console.error('Error loading reservation history:', error);
    }
  }






  toggleTable(): void {
    this.showTable = !this.showTable;
    // Reload reservation history when toggling the table
    if (this.showTable) {
      this.loadReservationHistory();
    }
  }

  isTableShown(): boolean {
    return this.showTable;
  }
}
