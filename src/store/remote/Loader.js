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
import Repository from "../idnadrev/Repository";
import uuid from "uuid";
import {merged} from "./../DummyData.js"
import IdnadrevFile from "../idnadrev/IdnadrevFile";
import Thought from "../idnadrev/Thought";
import Task from "../idnadrev/Task";

export default class Loader {
  offline = false;
  remote = "http://localhost:8000/rest/v1"

  post(path, bodyObj, token = null, additionalHeaders = null) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json")
    headers.append("Accept", "application/json")
    if (additionalHeaders) {
      Object.assign(headers, additionalHeaders)
    }
    if (token) {
      headers.append("token", token)
    }

    const param = {
      method: "POST", body: JSON.stringify(bodyObj), headers: headers
    }
    return fetch(this.remote + path, param).then(response => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).catch(e => console.log(e))
  }

  get(path) {
    return fetch(this.remote + path).then(response => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).catch(e => console.log(e))
  }

  loadRepos() {
    console.log("loading repos")
    return this.get("/repo")
  }

  openRepository(id, username, password) {
    console.log("log into " + id)
    const cmd = new OpenRepository(username, password)
    return this.post("/repo/" + id, cmd)
  }

  createRepository(cmd) {
    if (cmd.local) {
      const repo = new Repository(cmd.name, uuid.v4(), true);

      localStorage.setItem(repo.id, JSON.stringify(repo))
      let ids = JSON.parse(localStorage.repositories)
      ids.push(repo.id);
      localStorage.repositories = JSON.stringify(ids)

      return new Promise(function (resolve, reject) {
        console.log("resolve")
        resolve({
          "id": repo.id,
          "token": null,
          "local": true
        })
      })
    } else {
      cmd.password = Array.from(new TextEncoder("utf-8").encode(cmd.password))
      return this.post("/repo", cmd)
    }
  }

  saveFile(file, repo) {
    if (repo.local) {
      localStorage.setItem(file.id, JSON.stringify(file))

      return new Promise(function (resolve, reject) {
        resolve(file)
      })
    } else {
      let send = Object.assign({}, file);
      if (typeof file.content === 'string') {
        send.content = Array.from(new TextEncoder("utf-8").encode(file.content))
      }
      if( Object.prototype.toString.call( send.tags) !== '[object Array]') {
        send.tags=[]
      }
      console.log(send)
      console.log(JSON.stringify(send))
      return this.post("/repo/" + repo.id + "/file", send, repo.token)
    }
  }

  loadLocalFiles(map) {
    if (typeof(Storage) !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const text = localStorage.getItem(localStorage.key(i));
        if (text && text !== "") {
          let file = JSON.parse(text)

          if (file.id && file.repository && file.tags) {
            const type = file.fileType ? file.fileType.toUpperCase() : "";

            if (type === "TASK") {
              file = Object.assign(new Task(), file)
            } else if (type === "DOCUMENT") {
              file = Object.assign(new Document(), file)
            } else if (type === "THOUGHT") {
              file = Object.assign(new Thought(), file)
            } else {
              file = Object.assign(new IdnadrevFile(), file)
            }

            map.set(file.id, file)
          }
        }
      }
    }
  }

  loadLocalRepos(map) {
    if (typeof(Storage) !== "undefined") {
      let ids = localStorage.repositories
      ids = ids && JSON.parse(ids)

      for (let id of ids) {
        let repo = localStorage.getItem(id)
        if (repo) {
          const parse = JSON.parse(repo)
          map.set(parse.id, parse)
        }
      }
    }
  }

  loadThoughts(repoId) {
    return this.get("/repo/" + repoId + "/thought/")
  }

  loadContent(id) {
    return new Promise((resolve, reject) => {
      resolve("")
    })
  }

  loadLocalRepositories() {
    if (typeof(Storage) !== "undefined") {
      if (!localStorage.repositories) {
        const repo = new Repository("Local", uuid.v4(), true)
        localStorage.repositories = JSON.stringify([repo.id])
        localStorage.setItem(repo.id, JSON.stringify(repo))

        for (let file of merged) {
          file.repository = repo.id

          localStorage.setItem(file.id, JSON.stringify(file))
        }
      }

      let repos = []
      const ids = JSON.parse(localStorage.repositories)
      for (let repoId of ids) {
        const item = JSON.parse(localStorage.getItem(repoId));
        if (item) {

          repos.push(item)
        } else {
          console.warn("No item found for " + repoId)
        }
      }

      return repos

    } else {
      return [new Repository("Local", uuid.v4(), true)]
    }
  }
}