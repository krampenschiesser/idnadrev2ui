import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddThoughtComponent } from './add-thought/add-thought.component';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from '../repository/overview/overview.component';
import { EditComponent } from '../repository/edit/edit.component';
import { ThoughtOverviewComponent } from './thought-overview/thought-overview.component';
import { ThoughtProcessComponent } from './thought-process/thought-process.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RepositoryModule } from '../repository/repository.module';

const routes: Routes = [
  {path: 'thought/process', component: ThoughtProcessComponent},
  {path: 'thought/:id', component: AddThoughtComponent},
  {path: 'thought/add', component: AddThoughtComponent},
  {path: 'thought', component: ThoughtOverviewComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    ButtonModule,
    RepositoryModule,
  ],
  declarations: [AddThoughtComponent, ThoughtOverviewComponent, ThoughtProcessComponent]
})
export class ThoughtModule { }
