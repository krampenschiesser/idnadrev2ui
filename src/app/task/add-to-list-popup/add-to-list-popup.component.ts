import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListService } from '../../service/list.service';
import List from '../../dto/List';
import Task from '../../dto/Task';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-to-list-popup',
  templateUrl: './add-to-list-popup.component.html',
  styleUrls: ['./add-to-list-popup.component.css'],
  providers: [ConfirmationService]

})
export class AddToListPopupComponent implements OnInit {
  visible = false;
  allLists = [];
  lists = [];
  @Input() tasks: Task[] = [];
  @Output() onClose = new EventEmitter<void>();
  blocked = false;

  constructor(private listService: ListService, private confirmationService: ConfirmationService, private messageService: MessageService) {

  }

  async ngOnInit() {
    await this.listService.loadAll();
    this.listService.files.subscribe(lists => {
      this.allLists = lists;
      this.lists = lists;
    });
  }

  @Input()
  set show(visible: boolean) {
    this.visible = visible;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!visible) {
      this.onClose.emit();
    }
  }

  onAddToList(list: List) {
    let message;
    if (this.tasks.length == 1) {
      message = 'Do you want to add ' + this.tasks[0].name + ' to the list ' + list.name + '?';
    } else {
      message = 'Do you want to add these ' + this.tasks.length + ' tasks to the list ' + list.name + '?';
    }
    this.confirmationService.confirm({
      message: message,
      header: 'Confirmation',
      accept: async () => {
        this.blocked = true;
        await this.listService.addTasksToList(list, this.tasks.map(t => t.id)).catch(e => {
          console.log(e);
          this.blocked = false;
          this.messageService.add({severity: 'error', summary: 'Failed to add to list ' + list.name});
        });
        this.blocked = false;
        this.visible = false;
        this.onClose.emit();
        this.messageService.add({severity: 'success', summary: 'Successfully added to list ' + list.name});
      }
    });
  }
}
