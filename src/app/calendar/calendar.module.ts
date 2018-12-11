import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthViewComponent } from './month-view/month-view.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { DayViewComponent } from './day-view/day-view.component';
import { DayAgendaComponent } from './day-agenda/day-agenda.component';
import { RouterModule } from '@angular/router';
import { DragDropModule } from 'primeng/primeng';

@NgModule({
  declarations: [MonthViewComponent, WeekViewComponent, DayViewComponent, DayAgendaComponent],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule
  ],
  exports: [MonthViewComponent, WeekViewComponent, DayViewComponent, DayAgendaComponent]
})
export class CalendarModule {
}
