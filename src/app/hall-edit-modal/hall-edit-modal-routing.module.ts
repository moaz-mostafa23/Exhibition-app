import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HallEditModalPage } from './hall-edit-modal.page';

const routes: Routes = [
  {
    path: '',
    component: HallEditModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HallEditModalPageRoutingModule {}
