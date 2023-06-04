import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PanelComponent } from './pages/panel/panel.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/subPanels/home/home.component';
import { UserManagerComponent } from './pages/subPanels/admin/user-manager/user-manager.component';
import { CreateByMeComponent } from './pages/subPanels/eventManager/create-by-me/create-by-me.component';
import { CreateComponent } from './pages/subPanels/eventManager/create/create.component';
import { MyInterestedComponent } from './pages/subPanels/personal/my-interested/my-interested.component';
import { ExploreComponent } from './pages/subPanels/diary/explore/explore.component';
import { VisualizerComponent } from './pages/visualizer/visualizer.component';

const routes: Routes = [
  {path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: RegisterComponent},
  {path: 'panel', component: PanelComponent},
  {path: 'visualizer', component: VisualizerComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
export const RoutingComponent = [
  LoginComponent,
  RegisterComponent,
  PanelComponent,
  PageNotFoundComponent,
  HomeComponent,
  UserManagerComponent,
  CreateByMeComponent,
  CreateComponent,
  MyInterestedComponent,
  ExploreComponent,
  VisualizerComponent
];
