import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { RepositoryModule } from './repository/repository.module';
import { SidebarModule, DialogModule, ButtonModule, MessageService } from 'primeng/primeng';
import {CardModule} from 'primeng/card';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import {TooltipModule} from 'primeng/tooltip';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';

const appRoutes: Routes = [
  // { path: 'repo',   component: OverviewComponent}, // <-- delete this line
  { path: '',   redirectTo: '/repo', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainNavigationComponent
  ],
  imports: [
    RepositoryModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    SidebarModule,
    FontAwesomeModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
