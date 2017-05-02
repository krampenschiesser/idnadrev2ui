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
import uuid from "uuid"
import {observable} from "mobx"

export default class Repository {
    id=null
    @observable name
    @observable token
    @observable local;

    constructor(name,id,local=false) {
        this.name=name
        this.id=id
        this.local=local
    }

    isOpen() {
        return this.token;
    }


}