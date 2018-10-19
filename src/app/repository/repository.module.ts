import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { BlockUIModule, ButtonModule, InputTextModule, MessagesModule, PanelModule, PasswordModule, ProgressSpinnerModule } from 'primeng/primeng';
import { AddShortComponent } from './add-short/add-short.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
    PasswordModule,
    ReactiveFormsModule,
    MessagesModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    PanelModule,
    FontAwesomeModule,
    ProgressSpinnerModule,
    BlockUIModule
  ],
  declarations: [OverviewComponent,  EditComponent, AddShortComponent]
})
export class RepositoryModule {
}
