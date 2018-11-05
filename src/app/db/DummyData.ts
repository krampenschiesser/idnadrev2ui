import * as moment from 'moment';
import BinaryFile from '../dto/BinaryFile';
import Repository from '../dto/Repository';
import { Tag } from '../dto/Tag';
import Task, { Delegation, DelegationState, FixedScheduling, ProposedDateTime, Scheduling, WorkUnit } from '../dto/Task';
import Thought from '../dto/Thought';
import { RepositoryId } from '../dto/RepositoryId';
import { fromHex } from '../crypto/CryptoHelper';
import Contact from '../dto/Contact';
import Template from '../dto/Template';
import List from '../dto/List';

export function generateRepositories(): Repository[] {
  return [new Repository('test', 'test'), new Repository('test2', 'test2')];
}

export function generateThoughts(repo: RepositoryId): Thought[] {
  let t1 = new Thought('test', [new Tag('tag1'), new Tag('tag2')]).withContent('hello world').withRepository(repo);
  let t2 = new Thought('Sauerland', [new Tag('tag1')]).withContent('hello Sauerland').withRepository(repo);
  let t3 = new Thought('Beer', [new Tag('tag1'), new Tag('tag3')]).withContent('I want **beer**').withRepository(repo);
  return [t1, t2, t3];
}

export function generateContacts(repo: RepositoryId): Contact[] {
  let c1 = new Contact('John Doe').withRepository(repo);
  c1.details.emails = ['john.doe@gmail.com'];
  let c2 = new Contact('Jane Doe').withRepository(repo);
  c2.content = [{label: 'testField', value: 'Hello world'}];
  c2.details.phones=['+49281937681']
  return [c1, c2];
}

export function generateTemplates(repo: RepositoryId): Template[] {
  let t1 = new Template('test template').withRepository(repo);
  t1.content = '# hello\n\n## world\n\n* 1\n* 2\n\nBla **Blubb**';
  return [t1];
}

export function generateList(tasks: Task[], repo: RepositoryId): List[] {
  let list = new List('testList').withRepository(repo);
  list.content = tasks.map(t => t.id);
  return [list];
}

export function generateTasks(repo: RepositoryId, contacts: Contact[]): Task[] {
  let t1 = new Task('Take safety break', [new Tag('tag1'), new Tag('tag2')]).withContent('Oh **yeah**').withRepository(repo);
  let t2 = new Task('Make barbequeue', [new Tag('grilling')]).withContent('I am hungry!!!').withRepository(repo);
  let t3 = new Task('Go to store', [new Tag('grilling')]).withContent('slow **traffic**').withRepository(repo);
  let t4 = new Task('Buy steak', [new Tag('beef')]).withContent('# I am hungry!!!').withRepository(repo);
  let t5 = new Task('Buy beer', [new Tag('drinks')]).withContent('I am thirsty!!!').withRepository(repo);
  let t6 = new Task('Finished', [new Tag('finished')]).withContent('A finished task...').withRepository(repo);
  t5.details.state = 'Asap';
  t4.details.state = 'Later';
  t3.details.delegation = new DelegationState();
  t3.details.delegation.current = new Delegation(contacts[0].id);

  t1.references = [t2.id];


  t6.details.finished = new Date();

  t4.parent = t3.id;
  t5.parent = t3.id;
  t3.parent = t2.id;

  let start = moment().hours(-10).minutes(0).toDate();
  let end = moment().hours(-10).minutes(+10).toDate();
  t4.details.workUnits.push(new WorkUnit().setStart(start).setEnd(end));

  let scheduled = new Task('scheduled').withRepository(repo);
  let fixedScheduling = new FixedScheduling();
  scheduled.details.estimatedTime = 45 * 60;
  fixedScheduling.scheduledDateTime = moment().toDate();

  let schedule = new Scheduling();
  schedule.fixedScheduling = fixedScheduling;
  scheduled.details.schedule = schedule;

  let proposed = new Task('proposed').withRepository(repo);
  proposed.details.estimatedTime = 60 * 60;
  let scheduling = new Scheduling();
  scheduling.proposedDate = new ProposedDateTime();
  scheduling.proposedDate.proposedDateTime = moment().add(2, 'day').toDate();
  proposed.details.schedule = scheduling;

  let retval = [t1, t2, t3, t4, t5, t6, scheduled, proposed];
  for (let i = 0; i < 10; i++) {
    let task = new Task('proposed-' + i).withRepository(repo);
    let sched = new Scheduling();
    if (i % 2 === 0) {
      sched.proposedDate = new ProposedDateTime();
      sched.proposedDate.proposedDateTime = moment().add(i + 1, 'day').toDate();
      sched.proposedDate.proposedDateOnly = true;
    } else {
      sched.proposedDate = new ProposedDateTime();
      sched.proposedDate.proposedDateTime = moment().add(i + 1, 'day').toDate();
      sched.proposedDate.proposedWeekOnly = true;
      // if (i / 2 > 3) {
      //   sched.proposedWeekDayYear.proposedWeekDay = moment().week();
      // }
    }
    task.details.schedule = sched;
    retval.push(task);
  }
  return retval;
}

export function generateBinaryFiles(repo: RepositoryId): BinaryFile[] {
  let retval = [];

  let jpg = new BinaryFile('some jpg').withRepository(repo);
  jpg.details.originalFileName = 'image.jpg';
  jpg.details.mimeType = 'image/jpeg';
  jpg.content = imageJpg();
  retval.push(jpg);

  let png = new BinaryFile('some png').withRepository(repo);
  png.details.originalFileName = 'image.png';
  png.details.mimeType = 'image/png';
  png.content = imagePng();
  retval.push(png);

  return retval;
}

export function generateManyTasks(repo: RepositoryId): Task[] {
  let retval = [];
  for (let i = 0; i < 20000; i++) {
    let t = new Task('Task ' + i).withContent('# Task' + i).withRepository(repo);
    retval.push(t);
  }
  return retval;
}

function imageJpg(): Uint8Array {
  // tslint:disable-next-line
  let hex = 'ffd8ffe000104a46494600010101004800480000fffe00134372656174656420776974682047494d50ffdb00430001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101ffdb00430101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101ffc20011080030003003011100021101031101ffc4001500010100000000000000000000000000000009ffc400160101010100000000000000000000000000000809ffda000c03010002100310000001a598674a000000000000000000000000003fffc40014100100000000000000000000000000000050ffda000801010001050213ffc40014110100000000000000000000000000000050ffda0008010301013f0113ffc40014110100000000000000000000000000000050ffda0008010201013f0113ffc40014100100000000000000000000000000000050ffda0008010100063f0213ffc40014100100000000000000000000000000000050ffda0008010100013f2113ffda000c03010002000300000010000000000000000000000000000fffc40014110100000000000000000000000000000050ffda0008010301013f1013ffc40014110100000000000000000000000000000050ffda0008010201013f1013ffc40014100100000000000000000000000000000050ffda0008010100013f1013ffd9';
  return fromHex(hex);
}

function imagePng(): Uint8Array {
  // tslint:disable-next-line
  let hex = '89504e470d0a1a0a0000000d4948445200000030000000300802000000d8606ed0000000097048597300000b1300000b1301009a9c180000000774494d4507e202160d3b27098a820a0000001d69545874436f6d6d656e7400000000004372656174656420776974682047494d50642e65070000003a4944415458c3edce311100300804b0a7fe05e2065cf4181205a9e99cf21221212121212121212121212121212121212121212121212121a15f163a0a02372a9693810000000049454e44ae426082';
  return fromHex(hex);
}