import Dexie from 'dexie';
import Task, {TaskContext, TaskState} from '../dto/Task';
import Thought from '../dto/Thought';
import Document from '../dto/Document';
import LocalCryptoStorage, {EncryptedData, Nonce} from './LocalCryptoStorage';
import IdnadrevFile from '../dto/IdnadrevFile';
import {generateThoughts} from './DummyData.tsx';

export function prepareForDb(obj: any): any {
    let entries = Object.entries(obj);
    let clone = {};

    for (let [key, val] of entries) {
        if (val instanceof Object && !(val instanceof Date)) {
            clone[key] = prepareForDb(val);
        } else {
            clone[key] = val;
        }
    }

    return clone;
}

interface PersistedTaskDetails {
    finished: boolean;
    delegation: boolean;
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
    details: PersistedTaskDetails
}

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
        this.on('populate', () => generateThoughts().forEach(t => this.store(t)));
    }

    store<T>(obj: T): Promise<string> {
        let json = JSON.stringify(obj);

        let [encrypted, nonce ] = this.localCrypto.encrypt(json);

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
            let data: PersistedTask = {
                data: encrypted,
                nonce: nonce,
                id: obj.id,
                details: {
                    finished: obj.isFinished,
                    delegation: obj.isDelegated,
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


}