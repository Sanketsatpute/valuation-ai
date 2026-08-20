import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ValuationCreateComponent } from './valuation/valuation-create.component';
import { NavValuationComponent } from './valuation/methods/nav-valuation.component';
import { FcfeValuationComponent } from './valuation/methods/fcfe-valuation.component';
import { FcffValuationComponent } from './valuation/methods/fcff-valuation.component';

const routes: Routes = [
  // { path: '', component: DashboardComponent },
  // { path: 'dashboard', component: DashboardComponent },
  {
    path: 'valuation', children: [
      { path: 'new', component: ValuationCreateComponent, children: [
        { path: 'nav', component: NavValuationComponent },
        // { path: 'fcfe', component: FcfeValuationComponent },
        // { path: 'fcff', component: FcffValuationComponent },
        { path: '', redirectTo: 'nav', pathMatch: 'full' },
        { path: '**', component: NavValuationComponent } 
      ] },
    ]
  },
  // { path: 'valuation/nav', component: ValuationCreateComponent },
  { path: '', redirectTo: 'valuation/new', pathMatch: 'full' },
  { path: '**', redirectTo:'valuation/new', pathMatch:'full'} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
