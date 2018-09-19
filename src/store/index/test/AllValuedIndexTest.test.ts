import {FileType} from "../../../dto/FileType";
import Task from "../../../dto/Task";
import AllValueIndex from "../AllValueIndex";


test('CRUD', () => {
    let index = new AllValueIndex('test', 'context', FileType.Task);
    let task = new Task("test");
    task.details.context = "hello";
    index.onUpdate(task);

    let value = index.getAllValues().values().next().value;
    expect(value).toEqual('hello');

    task.details.context = "world";
    index.onUpdate(task);

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
    let index = new AllValueIndex('test', 'context', FileType.Task);
    let task = new Task("test");
    index.onUpdate(task);

    let value = index.getAllValues().values().next().value;
    expect(value).toEqual(undefined);

    index.onDelete(task);
    let allValues = index.getAllValues();
    expect(allValues.size).toEqual(0);
    expect(index.inverse.size).toEqual(0);

    task.details.context = "world";
    index.onUpdate(task);
    task.details.context = undefined;
    index.onDelete(task);

    allValues = index.getAllValues();
    expect(allValues.size).toEqual(0);
    expect(index.inverse.size).toEqual(0);
});