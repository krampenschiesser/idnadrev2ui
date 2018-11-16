import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from './page-title/page-title.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule, TooltipModule } from 'primeng/primeng';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { ActiveTaskComponent } from './active-task/active-task.component';
import { PromodoroComponent } from './promodoro/promodoro.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    FontAwesomeModule,
    RouterModule,
    TooltipModule
  ],
  declarations: [PageTitleComponent, MainNavigationComponent, ActiveTaskComponent, PromodoroComponent],
  exports: [PageTitleComponent]
})
export class PageModule { }
