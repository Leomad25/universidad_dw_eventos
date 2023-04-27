import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModuls } from './auxiliary/material.module';
import { AngularModuls, Components } from "./auxiliary/angular.module";

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponent,
    Components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModuls,
    AngularModuls
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }