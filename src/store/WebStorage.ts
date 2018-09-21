import Dexie from 'dexie';
import Task, { TaskContext, TaskState } from '../dto/Task';
import Thought from '../dto/Thought';
import Document from '../dto/Document';
import IdnadrevFile from '../dto/IdnadrevFile';
import { generateBinaryFiles, generateRepositories, generateTasks, generateThoughts } from './DummyData';
import { TaskFilter } from './TaskFilter';
import { FileId } from '../dto/FileId';
import { Tag } from '../dto/Tag';
import { FileType } from '../dto/FileType';
import BinaryFile from '../dto/BinaryFile';
import FileFilter from './FileFilter';
import Repository from '../dto/Repository';
import { RepositoryId } from '../dto/RepositoryId';
import { EncryptedData, Nonce } from './CryptoHelper';
import Index, { indexFromJson, IndexType, IndexUpdateState } from './index/Index';

interface PersistedIdnadrevFile {
  data: EncryptedData;
  nonce: Nonce;
  id: FileId;
  repositoryId: RepositoryId
  type: FileType;
}

interface PersistedBinaryFile extends PersistedIdnadrevFile {
  dataBinary: EncryptedData;
  nonceBinary: Nonce;
}

interface PersistedRepository {
  id: FileId;
  name: string;
  data: EncryptedData;
  salt: Uint32Array;
  nonce: Nonce;
}

interface PersistedIndex {
  id: FileId;
  repositoryId: RepositoryId;
  data: EncryptedData;
  nonce: Nonce;
  type: IndexType;
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

export async function toThought(persisted: PersistedIdnadrevFile | undefined, repo: Repository): Promise<Thought | undefined> {
  if (persisted === undefined) {
    return persisted;
  }
  let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
  let parse = JSON.parse(decrypt);
  let thought = new Thought(parse.name, parse.tags, parse.content);
  Object.assign(thought, parse);
  fileDates(thought);
  return thought;
}

export async function toTask(persisted: PersistedIdnadrevFile | undefined, repo: Repository): Promise<Task | undefined> {
  if (persisted === undefined) {
    return persisted;
  }
  let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
  let parse = JSON.parse(decrypt);
  let task = new Task(parse.name, parse.tags, parse.content);
  Object.assign(task, parse);
  fileDates(task);

  if (typeof  task.details.finished === 'string') {
    task.details.finished = new Date(task.details.finished);
  }
  let current = task.details.delegation.current;
  if (current && typeof  current.delegationStarted === 'string') {
    current.delegationStarted = new Date(current.delegationStarted);
  }
  task.details.delegation.history.forEach(h => {
    if (typeof h.delegationStarted === 'string') {
      h.delegationStarted = new Date(h.delegationStarted);
    }
    if (typeof h.delegationEnded === 'string') {
      h.delegationEnded = new Date(h.delegationEnded);
    }
  });
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

async function toDocument(persisted: PersistedIdnadrevFile | undefined, repo: Repository): Promise<Document | undefined> {
  if (persisted === undefined) {
    return persisted;
  }
  let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
  let parse = JSON.parse(decrypt);
  let doc = new Document(parse.name, parse.tags, parse.content);
  Object.assign(doc, parse);
  fileDates(doc);
  return doc;
}

// async function toBinaryFileWithoutContent(persisted: PersistedBinaryFile | undefined, repo: Repository): Promise<BinaryFile | undefined> {
//   if (persisted === undefined) {
//     return persisted;
//   }
//   let decryptJson = await repo.decryptToText(persisted.data, persisted.nonce);
//   let parse = JSON.parse(decryptJson);
//   let file = new BinaryFile(parse.name, parse.tags);
//   Object.assign(file, parse);
//   fileDates(file);
//   return file;
// }

async function toBinaryFile(persisted: PersistedBinaryFile | undefined, repo: Repository): Promise<BinaryFile | undefined> {
  if (persisted === undefined) {
    return persisted;
  }
  let decryptJson = await repo.decryptToText(persisted.data, persisted.nonce);
  let decryptContent = await repo.decrypt(persisted.dataBinary, persisted.nonceBinary);
  let parse = JSON.parse(decryptJson);
  let file = new BinaryFile(parse.name, parse.tags);
  Object.assign(file, parse);
  fileDates(file);
  file.content = decryptContent;
  return file;
}

async function toIdnadrevFile(persisted: PersistedIdnadrevFile | undefined, repo: Repository): Promise<IdnadrevFile<any, any> | undefined> {
  if (persisted === undefined) {
    return persisted;
  }
  let decryptJson = await repo.decryptToText(persisted.data, persisted.nonce);
  let parse = JSON.parse(decryptJson);
  // let file = new IdnadrevFile(parse.name, parse.tags);
  // Object.assign(file, parse);
  fileDates(parse);
  return parse;
}

function toRepository(persisted: PersistedRepository): Repository {
  if (persisted === undefined) {
    return persisted;
  }
  let repository = new Repository(persisted.name, '');
  repository.id = persisted.id;
  repository.nonce = persisted.nonce;
  repository.data = persisted.data;
  repository.salt = persisted.salt;
  return repository;
}


export async function toIndex(persisted: PersistedIndex | undefined, repo: Repository): Promise<Index | undefined> {
  if (persisted === undefined) {
    return persisted;
  }
  let decrypt = await repo.decryptToText(persisted.data, persisted.nonce);
  let idx = indexFromJson(persisted.type, decrypt);
  return idx;
}

export default class WebStorage extends Dexie {
  static populate = true;
  files: Dexie.Table<PersistedIdnadrevFile, string>;
  repositories: Dexie.Table<PersistedRepository, string>;
  indexes: Dexie.Table<PersistedIndex, string>;

  constructor() {
    super('IdnadrevDb');
    this.version(1).stores({
      files: 'id, repositoryId, type',
      repositories: 'id, name',
      indexes: 'id, repositoryId'
    });
    this.on('populate', () => {
      if(!WebStorage.populate) {
        return;
      }
      try {
        let repos = generateRepositories();
        repos.forEach(r => this.storeRepository(r));
        let repo = repos[0];
        generateThoughts(repo.id).forEach(t => this.store(t, repo));
        generateTasks(repo.id).forEach(t => this.store(t, repo));
        generateBinaryFiles(repo.id).forEach(t => this.storeBinaryFile(t, repo));
        // generateManyTasks().forEach(t => this.store(t));
      } catch (e) {
        console.log('Could not create dummy data', e);
        throw e;
      }
    });
  }

  async storeIndex(index: Index, repo: Repository): Promise<string> {
    let [encrypted, nonce] = await repo.encrypt(index.toJson());
    let data: PersistedIndex = {
      data: encrypted,
      nonce: nonce,
      id: index.id,
      repositoryId: index.repo,
      type: index.getType(),
    };
    return this.indexes.put(data);
  }

  async storeRepository(obj: Repository): Promise<string> {
    let data: PersistedRepository = {
      data: obj.data,
      nonce: obj.nonce,
      salt: obj.salt,
      id: obj.id,
      name: obj.name,
    };
    await Promise.all(obj.indexes.map(async i => await this.storeIndex(i, obj)));
    return this.repositories.put(data);
  }

  async storeBinaryFile(obj: BinaryFile, repo: Repository) {
    console.log('storing %o', obj);
    let assign: BinaryFile = Object.assign({}, obj);
    assign.content = Uint8Array.of();

    let [encryptedJson, nonceJson] = await repo.encrypt(JSON.stringify(assign));
    let [encryptedContent, nonceContent] = await repo.encrypt(obj.content);

    let data: PersistedBinaryFile = {
      dataBinary: encryptedContent,
      data: encryptedJson,
      nonceBinary: nonceContent,
      nonce: nonceJson,
      id: obj.id,
      repositoryId: obj.repository,
      type: obj.fileType
    };
    await this.updateIndexes(repo, obj);
    return this.files.put(data);
  }

  async updateIndexes(repo: Repository, obj: IdnadrevFile<any, any>): Promise<string> {
    await Promise.all(repo.indexes.map(async i => {
      if (i.onUpdate(obj) === IndexUpdateState.CHANGED) {
        return await this.storeIndex(i, repo);
      } else {
        return 'no change';
      }
    }));
    return 'ok';
  }

  async store<T extends IdnadrevFile<any, any>>(obj: T, repo: Repository): Promise<string> {
    let json = JSON.stringify(obj);
    let [encrypted, nonce] = await repo.encrypt(json);
    let data: PersistedIdnadrevFile = {
      data: encrypted,
      nonce: nonce,
      id: obj.id,
      repositoryId: obj.repository,
      type: obj.fileType,
    };
    await this.updateIndexes(repo, obj);
    return this.files.put(data);
  }


  async loadOpenThoughts(repo: Repository): Promise<Thought[]> {
    let thoughts: PersistedIdnadrevFile[] = await this.files.where('type').equals(FileType.Thought).toArray();
    let returnvalue = [];
    for (let file of thoughts) {
      let thought = await toThought(file, repo);
      if (thought && !thought.isPostPoned()) {
        returnvalue.push(thought);
      }
    }
    return returnvalue;
  }

  async loadAllThoughts(repo: Repository): Promise<Thought[]> {
    let thoughts = await this.files.where('type').equals(FileType.Thought).toArray();

    let returnvalue = [];
    for (let file of thoughts) {
      let thought = await toThought(file, repo);
      if (thought) {
        returnvalue.push(thought);
      }
    }
    return returnvalue;
  }

  async loadThoughtById(id: string, repo: Repository): Promise<Thought | undefined> {
    let thought = await this.files.where('id').equals(id).first();
    return await toThought(thought, repo);
  }

  async loadDocumentById(id: string, repo: Repository): Promise<Document | undefined> {
    let doc = await this.files.where('id').equals(id).first();
    return await toDocument(doc, repo);
  }

  async loadTaskById(id: string, repo: Repository): Promise<Task | undefined> {
    let task = await this.files.where('id').equals(id).first();
    return await toTask(task, repo);
  }

  async getTasks(repo: Repository, filter?: TaskFilter): Promise<Task[]> {
    //
    // let promise = this.tasks.where('details.finished').equals(finished ? 1 : 0).and(t => {
    //   let valid = true;
    //   if (delegated !== null) {
    //     valid = t.details.delegation === (delegated ? 1 : 0);
    //   }
    //   if (valid && context !== null) {
    //     if (t.details.context) {
    //       valid = t.details.context.toLowerCase() === context.toLowerCase();
    //     } else {
    //       valid = false;
    //     }
    //   }
    //   if (valid && state !== null) {
    //     if (t.details.state) {
    //       valid = t.details.state === state;
    //     } else {
    //       valid = false;
    //     }
    //   }
    //   return valid;
    // }).toArray();
    let tasks: PersistedIdnadrevFile[] = await this.files.where('type').equals(FileType.Task).toArray();

    let mappedTasks: Task[] = [];

    for (let file of tasks) {
      let task = await toTask(file, repo);
      if (task) {
        mappedTasks.push(task);
      }
    }

    let name: string | null = filter && filter.name !== undefined ? filter.name.toLowerCase() : null;
    let delegatedTo: string | null = filter && filter.delegatedTo !== undefined ? filter.delegatedTo.toLowerCase() : null;
    let parent: FileId | null = filter && filter.parent !== undefined ? filter.parent : null;
    let scheduled: boolean | null = filter && filter.scheduled !== undefined ? filter.scheduled : null;
    let proposed: boolean | null = filter && filter.proposed !== undefined ? filter.proposed : null;
    let remainingTimeLessThen: number | null = filter && filter.remainingTimeLessThen !== undefined ? filter.remainingTimeLessThen : null;
    let tags: Tag[] | null = filter && filter.tags !== undefined ? filter.tags : null;
    let finished: boolean = filter && filter.finished !== undefined ? filter.finished : false;
    let delegated: boolean | null = filter && filter.delegated !== undefined ? filter.delegated : null;
    let context: TaskContext | null = filter && filter.context !== undefined ? filter.context : null;
    let state: TaskState | null = filter && filter.state !== undefined ? filter.state : null;

    let resultingTasks = mappedTasks.filter(t => {
      let valid = true;
      if (valid && name !== null) {
        valid = t.name.toLowerCase().indexOf(name) > 0;
      }
      if (valid && finished !== null) {
        valid = t.isFinished === finished;
      }
      if (valid && delegated !== null) {
        valid = t.isDelegated === delegated;
      }
      if (valid && context !== null) {
        valid = t.context === context;
      }
      if (valid && state !== null) {
        valid = t.state === state;
      }

      if (valid && delegatedTo !== null) {
        if (t.details.delegation.current && t.details.delegation.current.to) {
          valid = t.details.delegation.current.to.toLowerCase().indexOf(delegatedTo) > 0;
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
            if (u.end === undefined) {
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
        if (tags.length === 0) {
          valid = false;
        }
      }
      return valid;
    });

    let all: Task[] = [];
    for (let task of resultingTasks) {
      all.push(task);
      let parents = await this.loadParents(task, repo);
      parents.forEach(p => all.push(p));
    }
    return all;
  }

  async loadParents(t: Task, repo: Repository): Promise<Task[]> {
    if (t.parent) {
      let all: Task[] = [];

      let parent = await this.loadTaskById(t.parent, repo);
      if (parent) {
        all.push(parent);

        let parents = await this.loadParents(parent, repo);
        for (let other of parents) {
          if (other) {
            all.push(other);
          }
        }
      }
      return all;
    } else {
      return [];
    }
  }

  async getInitialTags(repo: Repository): Promise<Set<Tag>> {//this is crap need different solution
    // tslint:disable-next-line
    let tagMapper = (t: IdnadrevFile<any, any> | undefined) => {
      if (t) {
        return t.tags;
      } else {
        return [];
      }
    };
    let bare = await this.files.toArray();
    let loaded = await Promise.all(bare.map(async t => await toIdnadrevFile(t, repo)));
    let tags = loaded.map(tagMapper);
    let set = new Set();
    tags.forEach(t => {
      if (t) {
        set.add(t);
      }
    });
    return set;
  }

  async getAllContexts(repo: Repository): Promise<Set<TaskContext>> {//this is crap need different solution
    let contextMapper = (t: Task | undefined) => {
      if (t && t.details.context) {
        return t.details.context;
      } else {
        return '';
      }
    };
    let tasks = await Promise.all((await this.files.where('type').equals(FileType.Task).toArray()).map(async t => await toTask(t, repo)));
    let set = new Set();
    tasks.map(contextMapper).forEach(context => set.add(context));
    return set;
  }

  async getAllFiles(repo: Repository, fileFilter?: FileFilter): Promise<IdnadrevFile<any, any>[]> {
    fileFilter = !fileFilter ? {} : fileFilter;

    let lowerCase = fileFilter.name ? fileFilter.name.toLowerCase() : '';
    let filter = (file: IdnadrevFile<any, any> | undefined) => {
      fileFilter = !fileFilter ? {} : fileFilter; //for typescript
      if (file === undefined) {
        return false;
      } else {
        let valid = fileFilter.name ? file.name.toLowerCase().indexOf(lowerCase) >= 0 : true;
        if (valid && fileFilter.tags) {
          fileFilter.tags.map(requestedTag => {
            let requestedTagName = requestedTag.name.toLowerCase();
            return file.tags.some(tag => tag.name.toLowerCase() === requestedTagName);
          }).forEach(found => {
            valid = valid && found;
          });
          if (file.tags.length === 0) {
            valid = false;
          }
        }
        let content = file.content;
        if (valid && fileFilter.content && typeof content === 'string') {
          let stringContent: string = content as string;
          valid = stringContent.toLocaleLowerCase().indexOf(fileFilter.content) >= 0;
        } else if (fileFilter.content) {
          valid = false;
        }
        return valid;
      }
    };
    let types = fileFilter.types;
    if (!types) {
      types = [FileType.Binary, FileType.Document, FileType.Image, FileType.Task, FileType.Thought];
    }
    let results = await Promise.all(types.map(async t => {
      let filesForType = await this.files.where('type').equals(t).toArray();
      let functor = async (f: PersistedIdnadrevFile) => {
        if (t === FileType.Binary) {
          let bla: any = f;
          return toBinaryFile(bla, repo);
        } else if (t === FileType.Document) {
          return toDocument(f, repo);
        } else if (t === FileType.Thought) {
          return toThought(f, repo);
        } else if (t === FileType.Task) {
          return toTask(f, repo);
        } else {
          return undefined;
        }
      };
      let files = await Promise.all(filesForType.map(functor));
      return files.filter(filter);
    }));

    let final: IdnadrevFile<any, any>[] = [];
    results.forEach(files => files.forEach(f => {
      if (f) {
        final.push(f);
      }
    }));
    return final;
  }

  getRepositories(): Promise<Repository[]> {
    return this.repositories.toArray().then(persisted => persisted.map(t => toRepository(t)));
  }

  async loadIndexes(repo: Repository): Promise<Index[]> {
    let persisted = await this.indexes.where('repositoryId').equals(repo.id).toArray();
    let indexesUndefined: (Index | undefined)[] = await Promise.all(persisted.map(pi => toIndex(pi, repo)));
    // @ts-ignore
    let indexes: Index[] = indexesUndefined.filter(f => f !== undefined);
    return indexes;
  }
}