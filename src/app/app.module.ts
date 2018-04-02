import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { RouteRoutingModule } from './routes/route-routing.module';
import { FirstcomponentComponent } from './components/firstcomponent/firstcomponent.component';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    FirstcomponentComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouteRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
