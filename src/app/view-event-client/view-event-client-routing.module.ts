import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewEventClientPage } from './view-event-client.page';

const routes: Routes = [
  {
    path: '',
    component: ViewEventClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewEventClientPageRoutingModule {}
