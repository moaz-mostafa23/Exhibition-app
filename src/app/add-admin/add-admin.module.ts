import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAdminPageRoutingModule } from './add-admin-routing.module';

import { AddAdminPage } from './add-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddAdminPageRoutingModule
  ],
  declarations: [AddAdminPage]
})
export class AddAdminPageModule {}
