import Dexie from 'dexie';

Dexie.dependencies.indexedDB = require('fake-indexeddb');
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

class TestDb extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)
  contacts: Dexie.Table<IContact, number>; // number = type of the primkey
  //...other tables goes here...

  constructor() {
    super('TestDb');
    this.version(1).stores({
      contacts: '++id, first, last',
      //...other tables goes here...
    });
  }
}

interface IContact {
  id?: number,
  first: string,
  last: string
}


test('Dexie persistence', () => {
  let db = new TestDb();
  db.contacts.put({first: 'First name', last: 'Last name'});
  let first = db.contacts.where('first').equals('First name').first();
  return first.then(contact => {
    if (contact) {
      expect(contact.last).toBe('Last name');
    } else {
      expect(contact).not.toBeUndefined();
    }
  });
});