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

import Repository from "../idnadrev/Repository";
import uuid from "uuid";

export default class LocalRepositoryLoader {
  loadLocalRepositories() {
    if (typeof(Storage) !== "undefined") {
      if (!localStorage.repositories) {
        const repo = new Repository("Local", uuid.v4(), true)
        localStorage.repositories = JSON.stringify([repo.id])
        localStorage.setItem(repo.id, JSON.stringify(repo))
      }

      let repos = []
      const ids = JSON.parse(localStorage.repositories)
      for (let repoId of ids) {
        const item = JSON.parse(localStorage.getItem(repoId));
        if(item) {

          repos.push(item)
        }else{
          console.warn("No item found for "+repoId)
        }
      }

      return repos

    } else {
      return [new Repository("Local", uuid.v4(), true)]
    }
  }
}