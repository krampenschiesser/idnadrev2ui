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


import {merged} from "./../DummyData.js"

export  default  class Loader {
  id2Content = new Map(merged.filter((f) => !f.content).map((f) => [f.id, "Content for " + f.name]));

  loadContent(id) {
    console.log("loading content for "+id)
    return new Promise((resolve, e) => {
      setTimeout(() => {
        const content = this.id2Content.get(id)
        console.log("DONE loading content for "+id)
        resolve(content)
      }, 3000);
    });
  }
}