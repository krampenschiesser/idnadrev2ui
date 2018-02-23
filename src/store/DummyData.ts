import Thought from '../dto/Thought';
import { Tag } from '../dto/Tag';
import Task, { FixedScheduling, ProposedDateTime, ProposedWeekDayYear, Scheduling, WorkUnit } from '../dto/Task';
import moment from 'moment';
import { fromHex } from './LocalCryptoStorage';
import BinaryFile from '../dto/BinaryFile';
import IdnadrevFile from '../dto/IdnadrevFile';
import Repository from '../dto/Repository';

export function generateRepositories(): Repository[] {
  new Repository()
}

export function generateThoughts(): Thought[] {
  let t1 = new Thought('test', [new Tag('tag1'), new Tag('tag2')]).withContent('hello world');
  let t2 = new Thought('Sauerland', [new Tag('tag1')]).withContent('hello Sauerland');
  let t3 = new Thought('Beer', [new Tag('tag1'), new Tag('tag3')]).withContent('I want beer');
  return [t1, t2, t3];
}

export function generateTasks(): Task[] {
  let t1 = new Task('Take safety break', [new Tag('tag1'), new Tag('tag2')]).withContent('Oh **yeah**');
  let t2 = new Task('Make barbequeue', [new Tag('grilling')]).withContent('I am hungry!!!');
  let t3 = new Task('Go to store', [new Tag('grilling')]).withContent('slow **traffic**');
  let t4 = new Task('Buy steak', [new Tag('beef')]).withContent('# I am hungry!!!');
  let t5 = new Task('Buy beer', [new Tag('drinks')]).withContent('I am thirsty!!!');
  let t6 = new Task('Finished', [new Tag('finished')]).withContent('A finished task...');

  t6.details.finished = new Date();

  t1.details.context = 'outside';
  t4.details.context = 'store';
  t5.details.context = 'store';

  t4.parent = t3.id;
  t5.parent = t3.id;
  t3.parent = t2.id;

  let start = moment().hours(-10).minutes(0).toDate();
  let end = moment().hours(-10).minutes(+10).toDate();
  t4.details.workUnits.push(new WorkUnit().setStart(start).setEnd(end));

  let scheduled = new Task('scheduled');
  let fixedScheduling = new FixedScheduling();
  scheduled.details.estimatedTime = 45 * 60;
  fixedScheduling.scheduledDateTime = moment().toDate();

  let schedule = new Scheduling();
  schedule.fixedScheduling = fixedScheduling;
  scheduled.details.schedule = schedule;

  let proposed = new Task('proposed');
  proposed.details.estimatedTime = 60 * 60;
  let scheduling = new Scheduling();
  scheduling.proposedDate = new ProposedDateTime();
  scheduling.proposedDate.proposedDateTime = moment().add(2, 'day').toDate();
  proposed.details.schedule = scheduling;

  let retval = [t1, t2, t3, t4, t5, t6, scheduled, proposed];
  for (let i = 0; i < 10; i++) {
    let task = new Task('proposed-' + i);
    let sched = new Scheduling();
    if (i % 2 === 0) {
      sched.proposedDate = new ProposedDateTime();
      sched.proposedDate.proposedDateTime = moment().add(i + 1, 'day').toDate();
      sched.proposedDate.proposedDateOnly = true;
    } else {
      sched.proposedWeekDayYear = new ProposedWeekDayYear();
      sched.proposedWeekDayYear.proposedYear = moment().year();
      sched.proposedWeekDayYear.proposedWeek = moment().week();
      // if (i / 2 > 3) {
      //   sched.proposedWeekDayYear.proposedWeekDay = moment().week();
      // }
    }
    task.details.schedule = sched;

    retval.push(task);
  }
  return retval;
}

export function generateDocuments(): IdnadrevFile<{}, {}>[] {
  let retval = [];

  let jpg = new BinaryFile('some jpg');
  jpg.details.originalFileName = 'image.jpg';
  jpg.details.mimeType = 'image/jpeg';
  jpg.content = imageJpg();
  retval.push(jpg);

  let png = new BinaryFile('some png');
  png.details.originalFileName = 'image.png';
  png.details.mimeType = 'image/png';
  png.content = imagePng();
  retval.push(png);

  return retval;
}

export function generateManyTasks(): Task[] {
  let retval = [];
  for (let i = 0; i < 20000; i++) {
    let t = new Task('Task ' + i).withContent('# Task' + i);
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