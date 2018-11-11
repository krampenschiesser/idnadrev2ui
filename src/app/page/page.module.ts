import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from './page-title/page-title.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/primeng';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    FontAwesomeModule,
    RouterModule
  ],
  declarations: [PageTitleComponent, MainNavigationComponent],
  exports: [PageTitleComponent]
})
export class PageModule { }
