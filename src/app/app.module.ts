import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MockComponent } from './components/mock/mock.component';
import { DataService } from './services/api-util.service';
import { InstrumentComponent } from './components/instrument/instrument.component';

@NgModule({
  declarations: [
    AppComponent,
    MockComponent,
    InstrumentComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
