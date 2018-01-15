import Document from '../Document';
import Task from '../Task';
import Thought from '../Thought';
import { prepareForDb } from '../../store/WebStorage';

let structuredClone = require('realistic-structured-clone');

test('Clone document', () => {
  let item = new Document('hello');
  let clone = structuredClone(prepareForDb(item));
  expect(clone).not.toBeUndefined();
  expect(clone.name).not.toBeUndefined();
  expect(clone.name).toBe('hello');
  expect(clone.created).toEqual(item.created);
});
test('Clone task', () => {
  let item = new Task('hello');
  let clone = structuredClone(prepareForDb(item));
  expect(clone).not.toBeUndefined();
  expect(clone.name).not.toBeUndefined();
  expect(clone.name).toBe('hello');
  expect(clone.created).toEqual(item.created);
});
test('Clone thought', () => {
  let item = new Thought('hello');
  let clone = structuredClone(prepareForDb(item));
  expect(clone).not.toBeUndefined();
  expect(clone.name).not.toBeUndefined();
  expect(clone.name).toBe('hello');
  expect(clone.created).toEqual(item.created);
});