import Dexie from 'dexie';
import Task, { TaskContext, TaskState } from '../dto/Task';
import Thought from '../dto/Thought';
import Document from '../dto/Document';
import LocalCryptoStorage, { EncryptedData, Nonce } from './LocalCryptoStorage';
import IdnadrevFile from '../dto/IdnadrevFile';
import { generateTasks, generateThoughts } from './DummyData';
import { TaskFilter } from './TaskFilter';
import { FileId } from '../dto/FileId';
import { Tag } from '../dto/Tag';
import { FileType } from '../dto/FileType';

interface PersistedTaskDetails {
  finished: number;
  delegation: number;
  context: TaskContext | null;
  state: TaskState;
}

interface PersistedThoughtDetails {
}

interface PersistedThought {
  data: EncryptedData;
  nonce: Nonce;
  id: string;
  details: PersistedThoughtDetails;
}

interface PersistedDocument {
  data: EncryptedData;
  nonce: Nonce;
  id: string;
}

interface PersistedTask {
  data: EncryptedData;
  nonce: Nonce;
  id: string;
  details: PersistedTaskDetails;
}

// tslint:disable-next-line
function fileDates(file: IdnadrevFile<any, any>) {
  if (typeof file.created === 'string') {
    file.created = new Date(file.created);
  }
  if (typeof file.updated === 'string') {
    file.updated = new Date(file.updated);
  }
  if (typeof file.deleted === 'string') {
    file.deleted = new Date(file.deleted);
  }
}

export function toThought(persisted: PersistedThought | undefined, localCrypto: LocalCryptoStorage): Thought | undefined {
  if (persisted === undefined) {
    return persisted;
  }
  let decrypt = localCrypto.decrypt(persisted.data, persisted.nonce);
  let parse = JSON.parse(decrypt);
  let thought = new Thought(parse.name, parse.tags, parse.content);
  Object.assign(thought, parse);
  fileDates(thought);
  return thought;
}

export function toTask(persisted: PersistedTask | undefined, localCrypto: LocalCryptoStorage): Task | undefined {
  if (persisted === undefined) {
    return persisted;
  }
  let decrypt = localCrypto.decrypt(persisted.data, persisted.nonce);
  let parse = JSON.parse(decrypt);
  let task = new Task(parse.name, parse.tags, parse.content);
  Object.assign(task, parse);
  fileDates(task);

  if (typeof  task.details.finished === 'string') {
    task.details.finished = new Date(task.details.finished);
  }
  if (task.details.delegation && typeof  task.details.delegation.time === 'string') {
    task.details.delegation.time = new Date(task.details.delegation.time);
  }
  if (task.details.schedule) {
    let fixedScheduling = task.details.schedule.fixedScheduling;
    if (fixedScheduling && typeof fixedScheduling.scheduledDateTime === 'string') {
      fixedScheduling.scheduledDateTime = new Date(fixedScheduling.scheduledDateTime);
    }
    let proposedDate = task.details.schedule.proposedDate;
    if (proposedDate && typeof proposedDate.proposedDateTime === 'string') {
      proposedDate.proposedDateTime = new Date(proposedDate.proposedDateTime);
    }
    task.details.workUnits.forEach(unit => {
      if (typeof unit.start === 'string') {
        unit.start = new Date(unit.start);
      }
      if (typeof unit.end === 'string') {
        unit.end = new Date(unit.end);
      }
    });
  }

  return task;
}

function toDocument(persisted: PersistedDocument | undefined, localCrypto: LocalCryptoStorage): Document | undefined {
  if (persisted === undefined) {
    return persisted;
  }
  let decrypt = localCrypto.decrypt(persisted.data, persisted.nonce);
  let parse = JSON.parse(decrypt);
  let doc = new Document(parse.name, parse.tags, parse.content);
  Object.assign(doc, parse);
  fileDates(doc);
  return doc;
}

export default class WebStorage extends Dexie {
  tasks: Dexie.Table<PersistedTask, string>;
  docs: Dexie.Table<PersistedDocument, string>;
  thoughts: Dexie.Table<PersistedThought, string>;
  localCrypto: LocalCryptoStorage;

  constructor(crypto: LocalCryptoStorage) {
    super('IdnadrevDb');
    this.localCrypto = crypto;
    this.version(1).stores({
      tasks: 'id, details.finished, details.delegation, details.context, details.state',
      docs: 'id',
      thoughts: 'id, details.showAgainAfter',
    });
    this.on('populate', () => {
      generateThoughts().forEach(t => this.store(t));
      generateTasks().forEach(t => this.store(t));
      // generateManyTasks().forEach(t => this.store(t));
    });
  }

  store<T>(obj: T): Promise<string> {
    console.log('storing %o', obj);
    let json = JSON.stringify(obj);

    let [encrypted, nonce] = this.localCrypto.encrypt(json);

    if (obj instanceof Thought) {
      let data: PersistedThought = {
        data: encrypted,
        nonce: nonce,
        id: obj.id,
        details: {}
      };
      return this.thoughts.put(data);
    } else if (obj instanceof Document) {
      let data: PersistedDocument = {
        data: encrypted,
        nonce: nonce,
        id: obj.id,
      };
      return this.docs.put(data);
    } else if (obj instanceof Task) {
      if (obj.children) {
        obj.children = undefined;
      }
      let data: PersistedTask = {
        data: encrypted,
        nonce: nonce,
        id: obj.id,
        details: {
          finished: obj.isFinished ? 1 : 0,
          delegation: obj.isDelegated ? 1 : 0,
          context: obj.context,
          state: obj.state
        }
      };
      return this.tasks.put(data);
    }
    return Promise.reject('No compatible type ' + typeof obj);
  }

  loadOpenThoughts(): Promise<Thought[]> {
    return this.thoughts.toArray().then(thoughts => thoughts
      .map(t => toThought(t, this.localCrypto))
      .filter(t => t !== undefined && !t.isPostPoned())
    );
  }

  loadAllThoughts(): Promise<Thought[]> {
    return this.thoughts.toArray().then(thoughts => thoughts
      .map(t => toThought(t, this.localCrypto))
      .filter(t => t !== undefined)
    );
  }

  loadThoughtById(id: string): Promise<Thought | undefined> {
    return this.thoughts.where('id').equals(id).first().then(persistedThought => toThought(persistedThought, this.localCrypto));
  }

  loadDocumentById(id: string): Promise<Document | undefined> {
    return this.docs.where('id').equals(id).first().then(persistedDoc => toDocument(persistedDoc, this.localCrypto));
  }

  loadTaskById(id: string): Promise<Task | undefined> {
    return this.tasks.where('id').equals(id).first().then(persistedTask => toTask(persistedTask, this.localCrypto));
  }

  getTasks(filter?: TaskFilter): Promise<Task[]> {
    let finished: boolean = filter && filter.finished !== undefined ? filter.finished : false;
    let delegated: boolean | null = filter && filter.delegated !== undefined ? filter.delegated : null;
    let context: TaskContext | null = filter && filter.context !== undefined ? filter.context : null;
    let state: TaskState | null = filter && filter.state !== undefined ? filter.state : null;

    let promise = this.tasks.where('details.finished').equals(finished ? 1 : 0).and(t => {
      let valid = true;
      if (delegated !== null) {
        valid = t.details.delegation === (delegated ? 1 : 0);
      }
      if (valid && context !== null) {
        if (t.details.context) {
          valid = t.details.context.toLowerCase() === context.toLowerCase();
        } else {
          valid = false;
        }
      }
      if (valid && state !== null) {
        if (t.details.state) {
          valid = t.details.state === state;
        } else {
          valid = false;
        }
      }
      return valid;
    }).toArray();

    let mappedTasks: Promise<Task[]> = promise.then(tasks => tasks.map(t => toTask(t, this.localCrypto)).filter(t => t !== undefined));

    let name: string | null = filter && filter.name !== undefined ? filter.name.toLowerCase() : null;
    let delegatedTo: string | null = filter && filter.delegatedTo !== undefined ? filter.delegatedTo.toLowerCase() : null;
    let parent: FileId | null = filter && filter.parent !== undefined ? filter.parent : null;
    let scheduled: boolean | null = filter && filter.scheduled !== undefined ? filter.scheduled : null;
    let proposed: boolean | null = filter && filter.proposed !== undefined ? filter.proposed : null;
    let remainingTimeLessThen: number | null = filter && filter.remainingTimeLessThen !== undefined ? filter.remainingTimeLessThen : null;
    let tags: Tag[] | null = filter && filter.tags !== undefined ? filter.tags : null;

    let resultingTasks = mappedTasks.then(tasks => tasks.filter(t => {
      let valid = true;
      if (valid && name !== null) {
        valid = t.name.toLowerCase().indexOf(name) > 0;
      }
      if (valid && delegatedTo !== null) {
        if (t.details.delegation && t.details.delegation.to) {
          valid = t.details.delegation.to.toLowerCase().indexOf(delegatedTo) > 0;
        } else {
          valid = false;
        }
      }
      if (valid && parent !== null) {
        if (t.details.parent) {
          valid = t.details.parent === parent;
        } else {
          valid = false;
        }
      }
      if (valid && scheduled !== null) {
        if (scheduled) {
          valid = !!t.details.schedule && !!t.details.schedule.fixedScheduling;
        } else {
          valid = !t.details.schedule || !t.details.schedule.fixedScheduling;
        }
      }
      if (valid && proposed !== null) {
        if (proposed) {
          valid = !!t.details.schedule && (!!t.details.schedule.proposedDate || !!t.details.schedule.proposedWeekDayYear);
        } else {
          valid = !t.details.schedule || (!t.details.schedule.proposedDate && !t.details.schedule.proposedWeekDayYear);
        }
      }
      if (valid && remainingTimeLessThen !== null) {
        let estimatedTime = t.details.estimatedTime;
        if (estimatedTime) {
          let sum = 0;
          t.details.workUnits.filter(u => u.end !== null).map(u => {
            if (u.end === null) {
              throw 'cannot happen, just for TS';
            } else {
              return (u.end.getTime() - u.start.getTime());
            }
          }).forEach(time => sum = +time);
          let remaining = estimatedTime - sum;
          if (remaining > 0) {
            valid = remaining < remainingTimeLessThen;
          } else {
            valid = false;
          }
        } else {
          valid = false;
        }
      }
      if (valid && tags !== null) {
        tags.map(requestedTag => {
          let requestedTagName = requestedTag.name.toLowerCase();
          return t.tags.some(tag => tag.name.toLowerCase() === requestedTagName);
        }).forEach(found => valid = valid && found);
      }
      return valid;
    }));

    let retval: Promise<(Task | undefined)[][]> = resultingTasks.then(tasks => {
      let map = tasks.map(t => this.loadParent(t));

      return Promise.all(map);
    });
    return retval.then(r => {
      let tasks: Task[] = [];
      r.forEach(t => {
        t.forEach(o => {
          if (o !== undefined) {
            tasks.push(o);
          }
        });
      });
      return tasks;
    });
  }

  loadParent(t: Task): Promise<(Task | undefined)[]> {
    if (t.parent) {
      let promise = this.tasks.get(t.parent).then(persistedTask => toTask(persistedTask, this.localCrypto));
      let more: Promise<(Task | undefined)[]> = promise.then(parent => {
        if (parent !== undefined) {
          return this.loadParent(parent);
        } else {
          return Promise.resolve(undefined);
        }
      });
      return more.then(tasks => {
        let all = tasks.filter(task => task !== undefined);
        all.push(t);
        return all;
      });
    } else {
      return Promise.resolve([t]);
    }
  }

  getInitialTags(): Promise<Set<Tag>> {//this is crap need different solution
    // tslint:disable-next-line
    let tagMapper = (t: IdnadrevFile<any, any> | undefined) => {
      if (t) {
        return t.tags;
      } else {
        return [];
      }
    };
    let tags1 = this.tasks.toArray().then(tasks => tasks.map(t => toTask(t, this.localCrypto)).map(tagMapper));
    let tags2 = this.thoughts.toArray().then(tasks => tasks.map(t => toThought(t, this.localCrypto)).map(tagMapper));
    let tags3 = this.docs.toArray().then(tasks => tasks.map(t => toDocument(t, this.localCrypto)).map(tagMapper));

    let tagsPromise = Promise.all([tags1, tags2, tags3]).then((o: [Tag[][], Tag[][], Tag[][]]) => {
      let tags: Set<Tag> = new Set();
      o.forEach(arr1 => {
        arr1.forEach(arr2 => {
          arr2.forEach(tag => {
            tags.add(tag);
          });
        });
      });
      return tags;
    });
    return tagsPromise;
  }

  getAllContexts(): Promise<Set<TaskContext>> {//this is crap need different solution
    let contextMapper = (t: Task | undefined) => {
      if (t && t.details.context) {
        return t.details.context;
      } else {
        return '';
      }
    };
    let contexts = this.tasks.toArray().then(tasks => tasks.map(t => toTask(t, this.localCrypto)).map(contextMapper));

    return contexts.then(ctxs => {
      let all = new Set<TaskContext>();
      ctxs.forEach(t => all.add(t));
      return all;
    });
  }

  getAllFiles(fileType: FileType | undefined, nameFilter: string | undefined): Promise<IdnadrevFile<{}, {}>[]> {
    let allPromises: Promise<(IdnadrevFile<{}, {}> | undefined)[]>[] = [];

    let lowerCase = nameFilter ? nameFilter.toLowerCase() : '';
    let filter = nameFilter ? (file: IdnadrevFile<{}, {}> | undefined) => {
      if (file === undefined) {
        return false;
      } else {
        return file.name.toLowerCase().indexOf(lowerCase) > 0;
      }
    } : (file: IdnadrevFile<{}, {}>) => file !== undefined;

    if (fileType === FileType.Task || fileType === undefined) {
      let promise: Promise<(IdnadrevFile<{}, {}> | undefined)[]> = this.tasks.toArray().then(tasks => tasks.map(t => toTask(t, this.localCrypto)).filter(filter));
      allPromises.push(promise);
    }
    if (fileType === FileType.Thought || fileType === undefined) {
      let promise: Promise<(IdnadrevFile<{}, {}> | undefined)[]> = this.thoughts.toArray().then(tasks => tasks.map(t => toThought(t, this.localCrypto)).filter(filter));
      allPromises.push(promise);
    }
    if (fileType === FileType.Document || fileType === undefined) {
      let promise: Promise<(IdnadrevFile<{}, {}> | undefined)[]> = this.docs.toArray().then(tasks => tasks.map(t => toDocument(t, this.localCrypto)).filter(filter));
      allPromises.push(promise);
    }

    let final = Promise.all(allPromises).then(files => {
      let res: IdnadrevFile<{}, {}>[] = [];
      files.forEach(f => f.forEach(o => {
          if (o !== undefined) {
            res.push(o);
          }
        }
      ));
      return res;
    });

    return final;
  }
}