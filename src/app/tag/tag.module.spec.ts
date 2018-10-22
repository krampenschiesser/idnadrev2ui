import { TagModule } from './tag.module';

describe('TagModule', () => {
  let tagModule: TagModule;

  beforeEach(() => {
    tagModule = new TagModule();
  });

  it('should create an instance', () => {
    expect(tagModule).toBeTruthy();
  });
});
