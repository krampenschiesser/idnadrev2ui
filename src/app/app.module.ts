import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RepositoryModule } from './repository/repository.module';
import { SidebarModule, DialogModule, ButtonModule, MessageService } from 'primeng/primeng';
import { CardModule } from 'primeng/card';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { ThoughtModule } from './thought/thought.module';
import { DocumentModule } from './document/document.module';
import { ContactModule } from './contact/contact.module';

const appRoutes: Routes = [
  // { path: 'repo',   component: OverviewComponent}, // <-- delete this line
  {path: '', redirectTo: '/repo', pathMatch: 'full'},
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    RepositoryModule,
    ThoughtModule,
    DocumentModule,
    ContactModule,
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
    ToastModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
