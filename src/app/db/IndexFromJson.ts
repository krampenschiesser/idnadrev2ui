import AllValueIndex, { TagIndex } from './AllValueIndex';
import Index, { IndexType } from './Index';


export function indexFromJson(type: IndexType, json: string): Index {
  if (type === IndexType.ALL_VALUES) {
    return AllValueIndex.fromJson(json);
  }else if(type === IndexType.ALL_TAG) {
    return TagIndex.tagsFromJson(json);
  } else {
    throw 'unkown index type' + type;
  }
}