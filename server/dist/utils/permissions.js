"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const checkPermissions = (requestUser, createdById) => {
    // if(requestUser.role === 'admin') return
    if (requestUser.userId === createdById.toString())
        return;
    throw new errors_1.UnauthenticatedError("User doesn't have access to this route.");
};
exports.default = checkPermissions;
