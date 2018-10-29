import { InplaceModule } from './inplace.module';

describe('InplaceModule', () => {
  let inplaceModule: InplaceModule;

  beforeEach(() => {
    inplaceModule = new InplaceModule();
  });

  it('should create an instance', () => {
    expect(inplaceModule).toBeTruthy();
  });
});
