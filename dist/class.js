"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const base_service_class_1 = require("base-service-class");
const database_helpers_1 = require("database-helpers");
const node_debug_1 = require("node-debug");
const node_errors_1 = require("node-errors");
const system_lookup_service_1 = require("system-lookup-service");
let lookup;
class Service extends base_service_class_1.BaseService {
    preCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = new node_debug_1.Debug(`${this.debugSource}.preCreate`);
            debug.write(node_debug_1.MessageType.Entry);
            const lookupPrimaryKey = { uuid: this.createData.lookup_uuid };
            debug.write(node_debug_1.MessageType.Value, `lookupPrimaryKey=${JSON.stringify(lookupPrimaryKey)}`);
            debug.write(node_debug_1.MessageType.Step, 'Finding lookup...');
            lookup = yield system_lookup_service_1.service.findOne(this.query, lookupPrimaryKey);
            debug.write(node_debug_1.MessageType.Value, `lookup=${JSON.stringify(lookup)}`);
            const uniqueKey1 = {
                lookup_uuid: this.createData.lookup_uuid,
                lookup_code: this.createData.lookup_code,
            };
            debug.write(node_debug_1.MessageType.Value, `uniqueKey1=${JSON.stringify(uniqueKey1)}`);
            debug.write(node_debug_1.MessageType.Step, 'Checking unique key 1...');
            yield (0, database_helpers_1.checkUniqueKey)(this.query, this.tableName, uniqueKey1);
            const uniqueKey2 = {
                lookup_uuid: this.createData.lookup_uuid,
                meaning: this.createData.meaning,
            };
            debug.write(node_debug_1.MessageType.Value, `uniqueKey2=${JSON.stringify(uniqueKey2)}`);
            debug.write(node_debug_1.MessageType.Step, 'Checking unique key 2...');
            yield (0, database_helpers_1.checkUniqueKey)(this.query, this.tableName, uniqueKey2);
            debug.write(node_debug_1.MessageType.Exit);
        });
    }
    preUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = new node_debug_1.Debug(`${this.debugSource}.preUpdate`);
            debug.write(node_debug_1.MessageType.Entry);
            if (typeof this.updateData.lookup_uuid !== 'undefined' &&
                this.updateData.lookup_uuid !== this.row.lookup_uuid) {
                throw new node_errors_1.BadRequestError('lookup_uuid is not updateable');
            }
            const lookupPrimaryKey = { uuid: this.row.lookup_uuid };
            debug.write(node_debug_1.MessageType.Value, `lookupPrimaryKey=${JSON.stringify(lookupPrimaryKey)}`);
            debug.write(node_debug_1.MessageType.Step, 'Finding lookup...');
            lookup = yield system_lookup_service_1.service.findOne(this.query, lookupPrimaryKey);
            debug.write(node_debug_1.MessageType.Value, `lookup=${JSON.stringify(lookup)}`);
            if (typeof this.updateData.lookup_code !== 'undefined' &&
                this.updateData.lookup_code !== this.row.lookup_code) {
                const uniqueKey1 = {
                    lookup_uuid: this.row.lookup_uuid,
                    lookup_code: this.updateData.lookup_code,
                };
                debug.write(node_debug_1.MessageType.Value, `uniqueKey1=${JSON.stringify(uniqueKey1)}`);
                debug.write(node_debug_1.MessageType.Step, 'Checking unique key 1...');
                yield (0, database_helpers_1.checkUniqueKey)(this.query, this.tableName, uniqueKey1);
            }
            if (typeof this.updateData.meaning !== 'undefined' &&
                this.updateData.meaning !== this.row.meaning) {
                const uniqueKey2 = {
                    lookup_uuid: this.row.lookup_uuid,
                    lookup_code: this.updateData.meaning,
                };
                debug.write(node_debug_1.MessageType.Value, `uniqueKey2=${JSON.stringify(uniqueKey2)}`);
                debug.write(node_debug_1.MessageType.Step, 'Checking unique key 2...');
                yield (0, database_helpers_1.checkUniqueKey)(this.query, this.tableName, uniqueKey2);
            }
            debug.write(node_debug_1.MessageType.Exit);
        });
    }
    preDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = new node_debug_1.Debug(`${this.debugSource}.preDelete`);
            debug.write(node_debug_1.MessageType.Entry);
            const lookupPrimaryKey = { uuid: this.row.lookup_uuid };
            debug.write(node_debug_1.MessageType.Value, `lookupPrimaryKey=${JSON.stringify(lookupPrimaryKey)}`);
            debug.write(node_debug_1.MessageType.Step, 'Finding lookup...');
            lookup = yield system_lookup_service_1.service.findOne(this.query, lookupPrimaryKey);
            debug.write(node_debug_1.MessageType.Value, `lookup=${JSON.stringify(lookup)}`);
            debug.write(node_debug_1.MessageType.Exit);
        });
    }
    postCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = new node_debug_1.Debug(`${this.debugSource}.postCreate`);
            debug.write(node_debug_1.MessageType.Entry);
            const lookupValuesTableName = `${lookup.lookup_type}${this.tableName}`;
            debug.write(node_debug_1.MessageType.Value, `lookupValuesTableName=${lookupValuesTableName}`);
            const lookupValue = {
                lookup_code: this.createdRow.lookup_code,
                meaning: this.createdRow.meaning,
                description: this.createdRow.description,
                is_enabled: this.createdRow.is_enabled,
            };
            debug.write(node_debug_1.MessageType.Value, `lookupValue=${JSON.stringify(lookupValue)}`);
            debug.write(node_debug_1.MessageType.Step, 'Creating lookup value...');
            yield (0, database_helpers_1.createRow)(this.query, lookupValuesTableName, lookupValue);
            debug.write(node_debug_1.MessageType.Exit);
        });
    }
    postUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = new node_debug_1.Debug(`${this.debugSource}.postUpdate`);
            debug.write(node_debug_1.MessageType.Entry);
            const lookupValuesTableName = `${lookup.lookup_type}${this.tableName}`;
            debug.write(node_debug_1.MessageType.Value, `lookupValuesTableName=${lookupValuesTableName}`);
            const lookupValuePrimaryKey = { lookup_code: this.row.lookup_code };
            debug.write(node_debug_1.MessageType.Value, `lookupValuePrimaryKey=${JSON.stringify(lookupValuePrimaryKey)}`);
            const lookupValue = {
                lookup_code: this.updatedRow.lookup_code,
                meaning: this.updatedRow.meaning,
                description: this.updatedRow.description,
                is_enabled: this.updatedRow.is_enabled,
            };
            debug.write(node_debug_1.MessageType.Value, `lookupValue=${JSON.stringify(lookupValue)}`);
            debug.write(node_debug_1.MessageType.Step, 'Updating lookup value...');
            yield (0, database_helpers_1.updateRow)(this.query, lookupValuesTableName, lookupValuePrimaryKey, lookupValue);
            debug.write(node_debug_1.MessageType.Exit);
        });
    }
    postDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = new node_debug_1.Debug(`${this.debugSource}.postDelete`);
            debug.write(node_debug_1.MessageType.Entry);
            const lookupValuesTableName = `${lookup.lookup_type}${this.tableName}`;
            debug.write(node_debug_1.MessageType.Value, `lookupValuesTableName=${lookupValuesTableName}`);
            const lookupValuePrimaryKey = { lookup_code: this.row.lookup_code };
            debug.write(node_debug_1.MessageType.Value, `lookupValuePrimaryKey=${JSON.stringify(lookupValuePrimaryKey)}`);
            debug.write(node_debug_1.MessageType.Step, 'Deleting lookup value...');
            yield (0, database_helpers_1.deleteRow)(this.query, lookupValuesTableName, lookupValuePrimaryKey);
            debug.write(node_debug_1.MessageType.Exit);
        });
    }
}
exports.Service = Service;
