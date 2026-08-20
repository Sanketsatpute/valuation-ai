import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ValuationCreateComponent } from './valuation/valuation-create.component';
import { NavValuationComponent } from './valuation/methods/nav-valuation.component';
import { FcfeValuationComponent } from './valuation/methods/fcfe-valuation.component';
import { FcffValuationComponent } from './valuation/methods/fcff-valuation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ValuationCreateComponent,
    NavValuationComponent,
    FcfeValuationComponent,
    FcffValuationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
