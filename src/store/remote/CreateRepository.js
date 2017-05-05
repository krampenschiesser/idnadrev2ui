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

import {observable} from "mobx"

export default class CreateRepository {
    @observable name;
    @observable password;
    @observable encryption;
    @observable userName

    constructor(repoName, password, encryptionType = "ChaCha") {
        this.name = repoName;
        this.encryption = encryptionType;
        this.password = Array.from(new TextEncoder("utf-8").encode(password))
    }
}