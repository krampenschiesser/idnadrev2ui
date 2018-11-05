import { FormitemsModule } from './formitems.module';

describe('FormitemsModule', () => {
  let formitemsModule: FormitemsModule;

  beforeEach(() => {
    formitemsModule = new FormitemsModule();
  });

  it('should create an instance', () => {
    expect(formitemsModule).toBeTruthy();
  });
});
