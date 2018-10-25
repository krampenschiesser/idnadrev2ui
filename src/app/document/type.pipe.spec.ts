import { FileTypePipe } from './type.pipe';

describe('TypePipe', () => {
  it('create an instance', () => {
    const pipe = new FileTypePipe();
    expect(pipe).toBeTruthy();
  });
});
