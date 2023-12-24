import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationPageModule)
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'add-admin',
    loadChildren: () => import('./add-admin/add-admin.module').then(m => m.AddAdminPageModule)

  },
  {
    path: 'event/:name',
    loadChildren: () => import('./event/event.module').then(m => m.EventPageModule)
  },
  {
    path: 'hall/:name',
    loadChildren: () => import('./hall/hall.module').then(m => m.HallPageModule)
  },
  {
    path: 'hall-modal',
    loadChildren: () => import('./hall-modal/hall-modal.module').then(m => m.HallModalPageModule)

  },
  {
    path: 'hall-edit-modal',
    loadChildren: () => import('./hall-edit-modal/hall-edit-modal.module').then(m => m.HallEditModalPageModule)
  },
  {
    path: 'edit-admin',
    loadChildren: () => import('./edit-admin/edit-admin.module').then( m => m.EditAdminPageModule)
  },
  {
    path: 'create-event',
    loadChildren: () => import('./create-event/create-event.module').then( m => m.CreateEventPageModule)
  },
  {
    path: 'update-event',
    loadChildren: () => import('./update-event/update-event.module').then( m => m.UpdateEventPageModule)
  },
  {
    path: 'foresee',
    loadChildren: () => import('./foresee/foresee.module').then( m => m.ForeseePageModule)
  },
  {
    path: 'chat/:receiverId',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  }






];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
