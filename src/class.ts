import { BaseService, Query } from 'base-service-class';
import {
  checkUniqueKey,
  createRow,
  deleteRow,
  updateRow,
} from 'database-helpers';
import { Debug, MessageType } from 'node-debug';
import { BadRequestError } from 'node-errors';
import { Row as Lookup, service as lookupService } from 'system-lookup-service';

export { Query };

export type PrimaryKey = {
  uuid?: string;
};

export type Data = {
  lookup_uuid: string;
  lookup_code: string;
  meaning: string;
  description?: string | null;
  is_enabled?: boolean;
};

export type CreateData = PrimaryKey & Data;
export type UpdateData = Partial<Data>;
export type Row = Required<PrimaryKey> & Required<Data>;

let lookup: Lookup;

const lookupValuesTableName = (lookupType: string) =>
  `${lookupType}_lookup_values`;

export class Service extends BaseService<
  PrimaryKey,
  CreateData,
  UpdateData,
  Row
> {
  async preCreate() {
    const debug = new Debug(`${this.debugSource}.preCreate`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, 'Finding lookup...');
    lookup = await lookupService.findOne(this.query, {
      uuid: this.createData.lookup_uuid,
    });
    const uniqueKey1 = {
      lookup_uuid: this.createData.lookup_uuid,
      lookup_code: this.createData.lookup_code,
    };
    debug.write(MessageType.Value, `uniqueKey1=${JSON.stringify(uniqueKey1)}`);
    debug.write(MessageType.Step, 'Checking unique key 1...');
    await checkUniqueKey(this.query, this.tableName, uniqueKey1);
    const uniqueKey2 = {
      lookup_uuid: this.createData.lookup_uuid,
      meaning: this.createData.meaning,
    };
    debug.write(MessageType.Value, `uniqueKey2=${JSON.stringify(uniqueKey2)}`);
    debug.write(MessageType.Step, 'Checking unique key 2...');
    await checkUniqueKey(this.query, this.tableName, uniqueKey2);
    debug.write(MessageType.Exit);
  }

  async preUpdate() {
    const debug = new Debug(`${this.debugSource}.preUpdate`);
    debug.write(MessageType.Entry);
    if (
      typeof this.updateData.lookup_uuid !== 'undefined' &&
      this.updateData.lookup_uuid !== this.row.lookup_uuid
    ) {
      throw new BadRequestError('lookup_uuid is not updateable');
    }
    debug.write(MessageType.Step, 'Finding lookup...');
    lookup = await lookupService.findOne(this.query, {
      uuid: this.row.lookup_uuid,
    });
    if (
      typeof this.updateData.lookup_code !== 'undefined' &&
      this.updateData.lookup_code !== this.row.lookup_code
    ) {
      const uniqueKey1 = {
        lookup_uuid: this.row.lookup_uuid,
        lookup_code: this.updateData.lookup_code,
      };
      debug.write(
        MessageType.Value,
        `uniqueKey1=${JSON.stringify(uniqueKey1)}`,
      );
      debug.write(MessageType.Step, 'Checking unique key 1...');
      await checkUniqueKey(this.query, this.tableName, uniqueKey1);
    }
    if (
      typeof this.updateData.meaning !== 'undefined' &&
      this.updateData.meaning !== this.row.meaning
    ) {
      const uniqueKey2 = {
        lookup_uuid: this.row.lookup_uuid,
        lookup_code: this.updateData.meaning,
      };
      debug.write(
        MessageType.Value,
        `uniqueKey2=${JSON.stringify(uniqueKey2)}`,
      );
      debug.write(MessageType.Step, 'Checking unique key 2...');
      await checkUniqueKey(this.query, this.tableName, uniqueKey2);
    }
    debug.write(MessageType.Exit);
  }

  async preDelete() {
    const debug = new Debug(`${this.debugSource}.preDelete`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, 'Finding lookup...');
    lookup = await lookupService.findOne(this.query, {
      uuid: this.row.lookup_uuid,
    });
    debug.write(MessageType.Exit);
  }

  async postCreate() {
    const debug = new Debug(`${this.debugSource}.postCreate`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, 'Creating lookup value...');
    await createRow(this.query, lookupValuesTableName(lookup.lookup_type), {
      lookup_code: this.row.lookup_code,
      meaning: this.row.meaning,
      description: this.row.description,
      is_enabled: this.row.is_enabled,
    });
    debug.write(MessageType.Exit);
  }

  async postUpdate() {
    const debug = new Debug(`${this.debugSource}.postUpdate`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, 'Updating lookup value...');
    await updateRow(
      this.query,
      lookupValuesTableName(lookup.lookup_type),
      { lookup_code: this.oldRow.lookup_code },
      {
        lookup_code: this.row.lookup_code,
        meaning: this.row.meaning,
        description: this.row.description,
        is_enabled: this.row.is_enabled,
      },
    );
    debug.write(MessageType.Exit);
  }

  async postDelete() {
    const debug = new Debug(`${this.debugSource}.postDelete`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, 'Deleting lookup value...');
    await deleteRow(this.query, lookupValuesTableName(lookup.lookup_type), {
      lookup_code: this.row.lookup_code,
    });
    debug.write(MessageType.Exit);
  }
}
