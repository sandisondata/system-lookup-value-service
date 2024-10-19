"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.service = void 0;
const class_1 = require("./class");
exports.service = new class_1.Service('system-lookup-value-service', '_lookup_values', ['uuid'], ['lookup_uuid', 'lookup_code', 'meaning', 'description', 'is_enabled'], false);
