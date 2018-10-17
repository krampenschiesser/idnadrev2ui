import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/primeng';

const routes: Routes = [
  {path: 'repo', component: OverviewComponent},
  {path: 'repo/edit/:id', component: EditComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    DialogModule,
    PasswordModule
  ],
  declarations: [OverviewComponent,  EditComponent]
})
export class RepositoryModule {
}
