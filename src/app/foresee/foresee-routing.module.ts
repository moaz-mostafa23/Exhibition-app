import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForeseePage } from './foresee.page';

const routes: Routes = [
  {
    path: '',
    component: ForeseePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForeseePageRoutingModule {}
