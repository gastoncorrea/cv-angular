import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component'; // Import UserComponent

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'user/create',
    component: UserComponent
  },
  {
    path: 'user/edit/:id',
    component: UserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
