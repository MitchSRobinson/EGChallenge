import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { InstrumentComponent } from './components/instrument/instrument.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'instrument/:id', component: InstrumentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
