import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateEventPage } from './update-event.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateEventPageRoutingModule {}
