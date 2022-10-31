"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundMiddlware = (req, res, next) => res.status(404).send("Route not found - from not-found MIDDLEWARE");
exports.default = notFoundMiddlware;
