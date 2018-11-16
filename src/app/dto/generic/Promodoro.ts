import Generic from '../Generic';

export default class Promodoro {
  intervals: number;
  workTime: number;
  breakTime: number;

  constructor(generic?: Generic) {
    if (generic) {
      Object.assign(this, generic.content);
    } else {
      this.intervals = 4;
      this.workTime = 25;
      this.breakTime = 5;
    }
  }

  toGeneric(): Generic {
    let generic = new Generic('promodoro');
    generic.content = {};
    Object.assign(generic.content, this);
    return generic;
  }
}