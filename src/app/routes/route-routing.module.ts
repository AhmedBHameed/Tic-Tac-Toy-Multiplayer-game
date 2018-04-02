import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from '../app.component';
import { FirstcomponentComponent } from '../components/firstcomponent/firstcomponent.component';
import { HomeComponent } from '../components/home/home.component';

// To add routing with angular cli
// ng g m route --routing
const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: HomeComponent, data: { title: 'Home page'}},  
  { path: 'tictactoy', component: FirstcomponentComponent, data: {title: 'Tic-Tac-Toy'}},
  // { path: '', component: AppComponent, children: [
  //   { path: '', component: FirstcomponentComponent }
  // ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
