import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from './page-title/page-title.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule, SidebarModule, TooltipModule } from 'primeng/primeng';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { ActiveTaskComponent } from './active-task/active-task.component';
import { PromodoroComponent } from './promodoro/promodoro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormitemsModule } from '../formitems/formitems.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    FontAwesomeModule,
    RouterModule,
    TooltipModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    FormitemsModule,
    RoundProgressModule,
  ],
  declarations: [PageTitleComponent, MainNavigationComponent, ActiveTaskComponent, PromodoroComponent],
  exports: [PageTitleComponent]
})
export class PageModule { }
