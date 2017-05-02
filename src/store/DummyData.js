/*
 * Copyright 2017 Christian Löhnert. See the COPYRIGHT
 * file at the top-level directory of this distribution.
 *
 * Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
 * http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
 * option. This file may not be copied, modified, or distributed
 * except according to those terms.
 */

import Thought from "./idnadrev/Thought";
import Task from "./idnadrev/Task";

const longText = `
# Intro
Go ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com). You can type the Markdown syntax, use the toolbar, or use shortcuts like _cmd-b_ or _ctrl-b_.

## Lists
Unordered lists can be started using the toolbar or by typing _* _, _- _, or _+ _. Ordered lists can be started by typing _1. _.

#### Unordered
* Lists are a piece of cake
* They even auto continue as you type
* A double enter will end them
* Tabs and shift-tabs work too

#### Ordered
1. Numbered lists...
2. ...work too!

## What about images?
![Yes](https://i.imgur.com/sZlktY7.png)


## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## words words words
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet,
`;


let thoughts = [
  new Thought("just a thought"),
  new Thought("Hello world", ["bla", "blubb"], `# hello world title
* bla
* blubb`),
  new Thought("Hello Sauerland", ["bla", "other"], 'I love **markdown**'),
  new Thought("A long thought", ["task", "other", "tag2"], longText),
  new Thought("No content", [], null),
]
const t1 = new Task("A Task", ["task", "other"], '## i am a task\nhrello task')
const t2 = new Task("A child task", ["task", "other"], '## i am a **child** task\nhrello task')
const t3 = new Task("A child child task", ["task", "other"], '## i am a **child** **child** task\nhrello task')
t2.parent = t1.id
t3.parent = t2.id

const asyncTask = new Task("Async task without initial content", ["tag1"], null)

let tasks = [t1, t2, t3, asyncTask]


export const merged = thoughts.concat(tasks);

export const all = merged.map((element) => [element.id, element])
