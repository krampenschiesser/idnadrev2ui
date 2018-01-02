export interface IGlobalStore {
    getTagsStartingWith(input: string): string[];
}

export class GlobalStore implements IGlobalStore {

    getTagsStartingWith(input: string): string[] {
        return ['beer', 'steak', 'pipe'].filter(val => val.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()));
    }
}