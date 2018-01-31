import Thought from '../dto/Thought';
import { Tag } from '../dto/Tag';
import Task, { FixedScheduling, ProposedDateTime, Scheduling, WorkUnit } from '../dto/Task';
import moment from 'moment';

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
  return [t1, t2, t3, t4, t5, t6, scheduled, proposed];
}

export function generateManyTasks(): Task[] {
  let retval = [];
  for (let i = 0; i < 20000; i++) {
    let t = new Task('Task ' + i).withContent('# Task' + i);
    retval.push(t);
  }
  return retval;
}