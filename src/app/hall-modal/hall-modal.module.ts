import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HallModalPageRoutingModule } from './hall-modal-routing.module';

import { HallModalPage } from './hall-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HallModalPageRoutingModule
  ],
  declarations: [HallModalPage]
})
export class HallModalPageModule {}
