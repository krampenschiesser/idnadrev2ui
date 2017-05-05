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

import OpenRepository from "./OpenRepository";
export default class Loader {
    offline = false;
    remote = "http://localhost:8000/rest/v1/"

    loadRepos() {
        console.log("loading repos")
        return fetch(this.remote + "repo").then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            } else {
                console.log("Got response " + response)
            }
            return response.json()
        }).catch(e => console.log(e))
    }

    post(path, bodyObj) {
        const param = {
            method: "POST", body: JSON.stringify(bodyObj), headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            }
        }
        return fetch(this.remote + path, param).then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
        }).catch(e => console.log(e))
    }

    openRepository(id, username, password) {
        console.log("log into " + id)
        const cmd = new OpenRepository(username, password)
        return this.post("repo/" + id,cmd)
    }
    createRepository(cmd) {
        cmd.password = Array.from(new TextEncoder("utf-8").encode(cmd.password))
        if (!cmd.encryption) {
            // cmd.encryption= 'ChaCha';
        }
        console.log("create repository " + cmd.name)
        return this.post("repo",cmd)
    }

    loadContent(id) {
        "".toJSON();
    }

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