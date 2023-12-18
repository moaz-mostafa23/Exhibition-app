import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HallEditModalPageRoutingModule } from './hall-edit-modal-routing.module';

import { HallEditModalPage } from './hall-edit-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HallEditModalPageRoutingModule
  ],
  declarations: [HallEditModalPage]
})
export class HallEditModalPageModule {}
