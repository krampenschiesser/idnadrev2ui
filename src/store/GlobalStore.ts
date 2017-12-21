export interface IGlobalStore {
  getTagsStartingWith(input: string): string[];
}

export class GlobalStore implements IGlobalStore {

  getTagsStartingWith(input: string): string[] {
    return [];
  }
}