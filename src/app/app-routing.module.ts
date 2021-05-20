import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/home/administration/register/register.component';
import { SensorsComponent } from './components/home/administration/sensors/sensors.component';
import { HomeComponent } from './components/home/home.component';
import { FormProjectComponent } from './components/home/projects/form-project/form-project.component';
import { ProjectsComponent } from './components/home/projects/projects.component';
import { UserProfileComponent } from './components/home/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { ProdGuardService as guard } from './guards/prod-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, children: [
    { path: '', redirectTo: 'projects', pathMatch: 'full' },
    {
      path: 'projects',
      component: ProjectsComponent,
      canActivate: [guard], 
      data: { expectedRol: ['admin', 'user'] }
    },
    {
      path: 'form-project',
      component: FormProjectComponent,
      canActivate: [guard], 
      data: { expectedRol: ['admin', 'user'] }
    },
    {
      path: 'user-profile',
      component: UserProfileComponent,
      canActivate: [guard], 
      data: { expectedRol: ['admin', 'user'] }
    },
    {
      path: 'admin-users',
      component: RegisterComponent,
      canActivate: [guard],
      data: { expectedRol: ['admin'] }
    },
    {
      path: 'admin-sensors',
      component: SensorsComponent,
      canActivate: [guard],
      data: { expectedRol: ['admin'] }
    }
  ]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
