import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {path: 'repo', redirectTo: 'repo/overview', pathMatch: 'full'},
  {path: 'repo/overview', component: OverviewComponent},
  {path: 'repo/login/:id', component: LoginComponent},
  {path: 'repo/logout/:id', component: LogoutComponent},
  {path: 'repo/edit/:id', component: EditComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OverviewComponent, LoginComponent, LogoutComponent, EditComponent]
})
export class RepositoryModule {
}
