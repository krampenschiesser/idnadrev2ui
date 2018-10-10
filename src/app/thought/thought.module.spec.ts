import { ThoughtModule } from './thought.module';

describe('ThoughtModule', () => {
  let thoughtModule: ThoughtModule;

  beforeEach(() => {
    thoughtModule = new ThoughtModule();
  });

  it('should create an instance', () => {
    expect(thoughtModule).toBeTruthy();
  });
});
