import Task from '../Task';

test('TaskFinishedAccess', function () {
  let task = new Task('test');
  let val = task['isFinished'];
  expect(val).toBeFalsy();
  task.details.finished=new Date();
  val = task['isFinished'];
  expect(val).toBeTruthy();
});