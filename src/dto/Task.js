"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array && function (d, b) {
            d.__proto__ = b;
        }) ||
        function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", {value: true});
var mobx_1 = require("mobx");
var IdnadrevFile_1 = require("./IdnadrevFile");
var FileType_1 = require("./FileType");
var TaskState;
(function (TaskState) {
    TaskState[TaskState["None"] = 0] = "None";
    TaskState[TaskState["Later"] = 1] = "Later";
    TaskState[TaskState["Delegated"] = 2] = "Delegated";
    TaskState[TaskState["Asap"] = 3] = "Asap";
})(TaskState = exports.TaskState || (exports.TaskState = {}));
var WorkUnit = /** @class */ (function () {
    function WorkUnit() {
        this.end = null;
        this.start = new Date();
    }

    __decorate([
        mobx_1.observable
    ], WorkUnit.prototype, "start", void 0);
    __decorate([
        mobx_1.observable
    ], WorkUnit.prototype, "end", void 0);
    return WorkUnit;
}());
exports.WorkUnit = WorkUnit;
var DelegationState = /** @class */ (function () {
    function DelegationState() {
    }

    __decorate([
        mobx_1.observable
    ], DelegationState.prototype, "time", void 0);
    __decorate([
        mobx_1.observable
    ], DelegationState.prototype, "to", void 0);
    return DelegationState;
}());
exports.DelegationState = DelegationState;
var ProposedDateTime = /** @class */ (function () {
    function ProposedDateTime() {
        this.proposedDateOnly = true;
    }

    __decorate([
        mobx_1.observable
    ], ProposedDateTime.prototype, "proposedDateTime", void 0);
    __decorate([
        mobx_1.observable
    ], ProposedDateTime.prototype, "proposedDateOnly", void 0);
    return ProposedDateTime;
}());
exports.ProposedDateTime = ProposedDateTime;
var ProposedWeekDayYear = /** @class */ (function () {
    function ProposedWeekDayYear() {
    }

    __decorate([
        mobx_1.observable
    ], ProposedWeekDayYear.prototype, "proposedYear", void 0);
    __decorate([
        mobx_1.observable
    ], ProposedWeekDayYear.prototype, "proposedWeek", void 0);
    __decorate([
        mobx_1.observable
    ], ProposedWeekDayYear.prototype, "proposedWeekDay", void 0);
    return ProposedWeekDayYear;
}());
exports.ProposedWeekDayYear = ProposedWeekDayYear;
var FixedScheduling = /** @class */ (function () {
    function FixedScheduling() {
        this.scheduledDateOnly = false;
    }

    __decorate([
        mobx_1.observable
    ], FixedScheduling.prototype, "scheduledDateTime", void 0);
    __decorate([
        mobx_1.observable
    ], FixedScheduling.prototype, "scheduledDateOnly", void 0);
    __decorate([
        mobx_1.observable
    ], FixedScheduling.prototype, "duration", void 0);
    return FixedScheduling;
}());
exports.FixedScheduling = FixedScheduling;
var Scheduling = /** @class */ (function () {
    function Scheduling() {
    }

    __decorate([
        mobx_1.observable
    ], Scheduling.prototype, "fixedScheduling", void 0);
    __decorate([
        mobx_1.observable
    ], Scheduling.prototype, "proposedWeekDayYear", void 0);
    __decorate([
        mobx_1.observable
    ], Scheduling.prototype, "proposedDate", void 0);
    return Scheduling;
}());
exports.Scheduling = Scheduling;
var TaskDetails = /** @class */ (function () {
    function TaskDetails() {
        this.state = TaskState.None;
        this.workUnits = [];
    }

    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "state", void 0);
    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "parent", void 0);
    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "context", void 0);
    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "estimatedTime", void 0);
    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "delegation", void 0);
    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "schedule", void 0);
    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "workUnits", void 0);
    __decorate([
        mobx_1.observable
    ], TaskDetails.prototype, "finished", void 0);
    return TaskDetails;
}());
exports.TaskDetails = TaskDetails;
var TaskContext = /** @class */ (function () {
    function TaskContext() {
    }

    return TaskContext;
}());
exports.TaskContext = TaskContext;
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);

    function Task(name, tags, content) {
        if (tags === void 0) {
            tags = [];
        }
        if (content === void 0) {
            content = '';
        }
        var _this = _super.call(this, name, FileType_1.FileType.Task) || this;
        _this.tags = tags;
        _this.content = content;
        _this.details = new TaskDetails();
        return _this;
    }

    Object.defineProperty(Task.prototype, "state", {
        get: function () {
            return this.details.state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "parent", {
        get: function () {
            return this.details.parent;
        },
        set: function (id) {
            this.details.parent = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "isDelegated", {
        get: function () {
            if (this.details.delegation) {
                return this.details.delegation.to !== null;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "isFinished", {
        get: function () {
            return this.details.finished != null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "context", {
        get: function () {
            return this.details.context;
        },
        enumerable: true,
        configurable: true
    });
    return Task;
}(IdnadrevFile_1.default));
exports.default = Task;
