import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import IdnadrevFileFilter, { filterFiles } from '../../filter/IdnadrevFileFilter';
import { ContactService } from '../../service/contact.service';
import Contact from '../../dto/Contact';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { DisplayService } from '../../service/display.service';
import ContactFilter from '../contact-filter/ContactFilter';

@Component({
  selector: 'app-contact-overview',
  templateUrl: './contact-overview.component.html',
  styleUrls: ['./contact-overview.component.css']
})
export class ContactOverviewComponent implements OnInit {
  contacts: Contact[];
  allContacts: Contact[];
  selection: Contact[] = [];
  circleIcon = faCircle;
  hoverRow?: number;

  constructor(private contactService: ContactService, private router: Router, public display: DisplayService) {
  }

  async ngOnInit() {
    await this.contactService.loadAll();
    this.contactService.files.subscribe(contacts => {
      this.allContacts = contacts;
      this.contacts = contacts;
    });
  }

  onFilter(filter: ContactFilter) {
    let checkProperty = undefined;
    if (filter.anyField) {

      let lowerCaseCOntent = filter.anyField.toLocaleLowerCase();
      checkProperty = (property) => {
        let str: string = property;
        if (str.toLocaleLowerCase().includes(lowerCaseCOntent)) {
          return true;
        } else {
          return false;
        }
      };
    }

    this.contacts = filterFiles(this.allContacts, filter, t => {
      if (checkProperty) {
        for (let property in t.details) {
          if (typeof t.details[property] === 'string') {
            console.log('checking ',property)
            if (checkProperty(t.details[property])) {
              return true;
            }
          } else if (Array.isArray(t.details[property])) {
            let array = t.details[property];
            for (let element of array) {
            console.log('checking array ',property, 'elemet: ',element)
              if (typeof element === 'string' && checkProperty(element)) {
                return true;
              }
            }
          }
        }
        return false;
      } else {
        return true;
      }
    });
  }

  showPreview(contact: Contact) {
    this.router.navigate([('/contact/' + contact.id)]);
  }

  addContact() {
    this.router.navigate(['/contact/add']);
  }

  delete(contact: Contact) {
    this.contactService.delete(contact);

  }

  edit(contact: Contact) {
    this.router.navigate(['/contact/edit/' + contact.id]);
  }

  getIconStyle(index: number): string {
    let colors = [
      '#DA4453',
      '#F67400',
      '#FDBC4B',
      '#27AE60',
      '#FE9EAD',
      '#60459F',
    ];
    let string = colors[index % colors.length];
    return string;
  }

  isSelected(contact: Contact) {
    return this.selection.includes(contact);
  }

  isRowHovered(rowIndex: number) {
    if (this.hoverRow !== undefined && this.hoverRow === rowIndex) {
      return true;
    } else {
      return false;
    }
  }

  setHoverRow(rowIndex?: number) {
    this.hoverRow = rowIndex;
  }

  deleteSelected() {
    this.contactService.deleteAll(this.selection);
    this.selection = [];
  }
}
