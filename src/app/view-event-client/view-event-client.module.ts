import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewEventClientPageRoutingModule } from './view-event-client-routing.module';

import { ViewEventClientPage } from './view-event-client.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewEventClientPageRoutingModule
  ],
  declarations: [ViewEventClientPage]
})
export class ViewEventClientPageModule {}
