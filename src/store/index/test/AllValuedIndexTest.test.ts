import { FileType } from '../../../dto/FileType';
import Task from '../../../dto/Task';
import AllValueIndex, { TagIndex } from '../AllValueIndex';
import { Tag } from '../../../dto/Tag';


test('CRUD', () => {
  let index = new AllValueIndex<string>('test', 'details.context', FileType.Task);
  let task = new Task('test');
  task.details.context = 'hello';
  index.onUpdate(task);

  let value = index.getAllValues().values().next().value;
  expect(value).toEqual('hello');
  expect(index.inverse.size).toEqual(1);
  let existing = index.inverse.get(task.id);
  expect(existing).toBeDefined();
  // @ts-ignore
  expect(existing.size).toEqual(1);

  task.details.context = 'world';
  index.onUpdate(task);
  expect(index.inverse.size).toEqual(1);
  existing = index.inverse.get(task.id);
  expect(existing).toBeDefined();
  // @ts-ignore
  expect(existing.size).toEqual(1);

  let allValues = index.getAllValues();
  expect(allValues.size).toEqual(1);
  value = allValues.values().next().value;
  expect(value).toEqual('world');

  index.onDelete(task);

  allValues = index.getAllValues();
  expect(allValues.size).toEqual(0);

  index.onUpdate(task);
  task.details.context = 'other';
  index.onDelete(task);
  allValues = index.getAllValues();
  expect(allValues.size).toEqual(0);
  expect(index.inverse.size).toEqual(0);
});

test('NullValue', () => {
  let index = new AllValueIndex<string>('test','details.context', FileType.Task);
  let task = new Task('test');
  index.onUpdate(task);

  let value = index.getAllValues().values().next().value;
  expect(value).toEqual(undefined);

  index.onDelete(task);
  let allValues = index.getAllValues();
  expect(allValues.size).toEqual(0);
  expect(index.inverse.size).toEqual(0);

  task.details.context = 'world';
  index.onUpdate(task);
  task.details.context = undefined;
  index.onDelete(task);

  allValues = index.getAllValues();
  expect(allValues.size).toEqual(0);
  expect(index.inverse.size).toEqual(0);
});

test('Array', function () {
  let index = new AllValueIndex<Tag>('test', 'tags', FileType.Task);
  let task = new Task('test');

  let value = index.getAllValues().values().next().value;
  expect(value).toEqual(undefined);
  task.tags = [new Tag('test1'), new Tag('test2')];

  index.onUpdate(task);
  let allValues = index.getAllValues();

  expect(allValues.size).toEqual(2);
  expect(index.inverse.size).toEqual(1);


  task.tags = [new Tag('test3'), new Tag('test2')];
  index.onDelete(task);

  allValues = index.getAllValues();

  expect(allValues.size).toEqual(0);
  expect(index.inverse.size).toEqual(0);

  index.onUpdate(task);
  task.tags= [new Tag('test3'), new Tag('test1')];
  index.onUpdate(task);
  allValues = index.getAllValues();

  expect(allValues.size).toEqual(2);
  expect(allValues).toContainEqual(new Tag("test3"));
  expect(allValues).toContainEqual(new Tag("test1"));
  expect(index.inverse.size).toEqual(1);
  let existing = index.inverse.get(task.id);
  expect(existing).toBeDefined();
  // @ts-ignore
  expect(existing.size).toEqual(2);

});

test('JSON conversion tags', function () {
  let index = new TagIndex('test');
  let task = new Task('test');
  task.tags = [new Tag('test1'), new Tag('test2')];
  index.onUpdate(task);

  let json = index.toJson();
  index = TagIndex.tagsFromJson(json);
  let allValues = index.getAllValues();

  expect(allValues.size).toEqual(2);
  expect(index.inverse.size).toEqual(1);
  let ids = index.getIds(new Tag('test1'));
  expect(ids.size).toEqual(1);
});

test('JSON conversion context', function () {
  let index = new AllValueIndex<string>('test', 'context', FileType.Task);
  let task = new Task('test');
  task.details.context='context';
  index.onUpdate(task);

  let json = index.toJson();
  index = AllValueIndex.fromJson(json);
  let allValues = index.getAllValues();

  expect(allValues.size).toEqual(1);
  expect(index.inverse.size).toEqual(1);
  let ids = index.getIds('context');
  expect(ids.size).toEqual(1);
});

test('boolean', () => {
  let index = new AllValueIndex<boolean>('test', 'isFinished', FileType.Task);
  let finishedTask = new Task('test');
  let unfinishedTask= new Task('test2');
  finishedTask.details.finished = new Date();
  index.onUpdate(finishedTask);
  index.onUpdate(unfinishedTask);

  expect(index.getIds(true).size).toEqual(1);
  expect(index.getIds(false).size).toEqual(1);

  let json = index.toJson();
  index = AllValueIndex.fromJson(json);
  expect(index.getIds(true).size).toEqual(1);
  expect(index.getIds(false).size).toEqual(1);
});