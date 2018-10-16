import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { RepositoryModule } from './repository/repository.module';
import { SidebarModule, } from 'primeng/primeng';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import {TooltipModule} from 'primeng/tooltip';


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
    RouterModule.forRoot(
      appRoutes,
    ),
    SidebarModule,
    FontAwesomeModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
