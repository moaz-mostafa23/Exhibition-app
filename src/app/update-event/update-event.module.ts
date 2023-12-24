import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { UpdateEventPageRoutingModule } from './update-event-routing.module';

import { UpdateEventPage } from './update-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateEventPageRoutingModule, 
    ReactiveFormsModule
  ],
  declarations: [UpdateEventPage]
})
export class UpdateEventPageModule {}
