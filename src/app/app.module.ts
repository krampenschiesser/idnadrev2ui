import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AppComponent } from './app.component';
import { OverviewComponent } from './repository/overview/overview.component';
import { RepositoryModule } from './repository/repository.module';

const appRoutes: Routes = [
  // { path: 'repo',   component: OverviewComponent}, // <-- delete this line
  { path: '',   redirectTo: '/repo', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RepositoryModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
