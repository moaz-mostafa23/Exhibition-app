// hall-modal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { HallModalPageRoutingModule } from './hall-modal-routing.module';

import { HallModalPage } from './hall-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HallModalPageRoutingModule
  ],
  declarations: [HallModalPage],
})
export class HallModalPageModule { }
