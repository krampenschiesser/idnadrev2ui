/**
 * Created by scar on 4/15/17.
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