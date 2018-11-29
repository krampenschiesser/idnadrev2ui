import { TaskFilterModule } from './task-filter.module';

describe('TaskFilterModule', () => {
  let taskFilterModule: TaskFilterModule;

  beforeEach(() => {
    taskFilterModule = new TaskFilterModule();
  });

  it('should create an instance', () => {
    expect(taskFilterModule).toBeTruthy();
  });
});
