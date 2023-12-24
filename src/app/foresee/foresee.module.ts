import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForeseePageRoutingModule } from './foresee-routing.module';

import { ForeseePage } from './foresee.page';

import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForeseePageRoutingModule,
    NgCalendarModule
  ],
  declarations: [ForeseePage]
})
export class ForeseePageModule {}
