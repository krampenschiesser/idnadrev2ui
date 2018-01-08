import Thought from '../dto/Thought';
import {Tag} from '../dto/Tag';

export function generateThoughts(): Thought[] {
    let t1 = new Thought('test', [new Tag('tag1'), new Tag('tag2')]).withContent('hello world');
    let t2 = new Thought('Sauerland', [new Tag('tag1')]).withContent('hello Sauerland');
    let t3 = new Thought('Beer', [new Tag('tag1'), new Tag('tag3')]).withContent('I want beer');
    return [t1, t2, t3];
}