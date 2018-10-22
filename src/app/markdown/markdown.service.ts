import { Injectable } from '@angular/core';
import { Marked, Renderer } from 'marked-ts';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {
    Marked.setOptions
    ({
      renderer: new Renderer,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });
  }

  render(markdown: string): string {
    return Marked.parse(markdown);
  }

}
