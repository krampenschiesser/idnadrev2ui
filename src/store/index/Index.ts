import IdnadrevFile from '../../dto/IdnadrevFile';

export default interface Index {
  onUpdate(file: IdnadrevFile<any, any>): void;
  onDelete(file: IdnadrevFile<any, any>): void;
}