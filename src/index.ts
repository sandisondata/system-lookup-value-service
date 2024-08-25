import { Query } from 'database';
import {
  checkPrimaryKey,
  checkUniqueKey,
  createRow,
  deleteRow,
  findByPrimaryKey,
  updateRow,
} from 'database-helpers';
import { Debug, MessageType } from 'node-debug';
import { objectsEqual, pick } from 'node-utilities';
import * as lookupService from 'repository-lookup-service';

const debugSource = 'lookup-value.service';
const debugRows = 3;

const tableName = '_lookup_values';
const instanceName = 'lookup_value';

const primaryKeyColumnNames = ['lookup_value_uuid'];
const dataColumnNames = [
  'lookup_uuid',
  'lookup_code',
  'meaning',
  'description',
  'is_enabled',
];
const columnNames = [...primaryKeyColumnNames, ...dataColumnNames];

export type PrimaryKey = {
  lookup_value_uuid: string;
};

export type Data = {
  lookup_uuid: string;
  lookup_code: string;
  meaning: string;
  description?: string | null;
  is_enabled?: boolean;
};

export type CreateData = PrimaryKey & Data;
export type Row = PrimaryKey & Required<Data>;
export type UpdateData = Partial<Omit<Data, 'lookup_uuid'>>;

export const create = async (query: Query, createData: CreateData) => {
  const debug = new Debug(`${debugSource}.create`);
  debug.write(MessageType.Entry, `createData=${JSON.stringify(createData)}`);
  const primaryKey: PrimaryKey = {
    lookup_value_uuid: createData.lookup_value_uuid,
  };
  debug.write(MessageType.Value, `primaryKey=${JSON.stringify(primaryKey)}`);
  debug.write(MessageType.Step, 'Checking primary key...');
  await checkPrimaryKey(query, tableName, instanceName, primaryKey);
  debug.write(MessageType.Step, 'Validating data...');
  const uniqueKey1 = {
    lookup_uuid: createData.lookup_uuid,
    lookup_code: createData.lookup_code,
  };
  debug.write(MessageType.Value, `uniqueKey1=${JSON.stringify(uniqueKey1)}`);
  debug.write(MessageType.Step, 'Checking unique key 1...');
  await checkUniqueKey(query, tableName, instanceName, uniqueKey1);
  const uniqueKey2 = {
    lookup_uuid: createData.lookup_uuid,
    meaning: createData.meaning,
  };
  debug.write(MessageType.Value, `uniqueKey2=${JSON.stringify(uniqueKey2)}`);
  debug.write(MessageType.Step, 'Checking unique key 2...');
  await checkUniqueKey(query, tableName, instanceName, uniqueKey2);
  debug.write(MessageType.Step, 'Finding lookup...');
  const lookup = await lookupService.findOne(query, {
    lookup_uuid: createData.lookup_uuid,
  });
  const lookupValue = pick(
    createData,
    dataColumnNames.filter((x) => x !== 'lookup_uuid'),
  );
  debug.write(MessageType.Value, `lookupValue=${JSON.stringify(lookupValue)}`);
  debug.write(MessageType.Step, 'Creating lookup value...');
  await createRow(query, `${lookup.lookup_type}_lookup_values`, lookupValue);
  debug.write(MessageType.Step, 'Creating row...');
  const createdRow = (await createRow(
    query,
    tableName,
    createData,
    columnNames,
  )) as Row;
  debug.write(MessageType.Exit, `createdRow=${JSON.stringify(createdRow)}`);
  return createdRow;
};

// TODO: query parameters + add actual query to helpers
export const find = async (query: Query) => {
  const debug = new Debug(`${debugSource}.find`);
  debug.write(MessageType.Entry);
  debug.write(MessageType.Step, 'Finding rows...');
  const rows = (
    await query(`SELECT * FROM ${tableName} ORDER BY lookup_value_uuid`)
  ).rows as Row[];
  debug.write(
    MessageType.Exit,
    `rows(${debugRows})=${JSON.stringify(rows.slice(0, debugRows))}`,
  );
  return rows;
};

export const findOne = async (query: Query, primaryKey: PrimaryKey) => {
  const debug = new Debug(`${debugSource}.findOne`);
  debug.write(MessageType.Entry, `primaryKey=${JSON.stringify(primaryKey)}`);
  debug.write(MessageType.Step, 'Finding row by primary key...');
  const row = (await findByPrimaryKey(
    query,
    tableName,
    instanceName,
    primaryKey,
    { columnNames: columnNames },
  )) as Row;
  debug.write(MessageType.Exit, `row=${JSON.stringify(row)}`);
  return row;
};

export const update = async (
  query: Query,
  primaryKey: PrimaryKey,
  updateData: UpdateData,
) => {
  const debug = new Debug(`${debugSource}.update`);
  debug.write(
    MessageType.Entry,
    `primaryKey=${JSON.stringify(primaryKey)};` +
      `updateData=${JSON.stringify(updateData)}`,
  );
  debug.write(MessageType.Step, 'Finding row by primary key...');
  const row = (await findByPrimaryKey(
    query,
    tableName,
    instanceName,
    primaryKey,
    { columnNames: columnNames, forUpdate: true },
  )) as Row;
  debug.write(MessageType.Value, `row=${JSON.stringify(row)}`);
  const mergedRow: Row = Object.assign({}, row, updateData);
  debug.write(MessageType.Value, `mergedRow=${JSON.stringify(mergedRow)}`);
  let updatedRow: Row = Object.assign({}, mergedRow);
  if (
    !objectsEqual(pick(mergedRow, dataColumnNames), pick(row, dataColumnNames))
  ) {
    debug.write(MessageType.Step, 'Validating data...');
    if (mergedRow.lookup_code !== row.lookup_code) {
      const uniqueKey1 = {
        lookup_uuid: row.lookup_uuid,
        lookup_code: updateData.lookup_code,
      };
      debug.write(
        MessageType.Value,
        `uniqueKey1=${JSON.stringify(uniqueKey1)}`,
      );
      debug.write(MessageType.Step, 'Checking unique key 1...');
      await checkUniqueKey(query, tableName, instanceName, uniqueKey1);
    }
    if (mergedRow.meaning !== row.meaning) {
      const uniqueKey2 = {
        lookup_uuid: row.lookup_uuid,
        lookup_code: updateData.meaning,
      };
      debug.write(
        MessageType.Value,
        `uniqueKey2=${JSON.stringify(uniqueKey2)}`,
      );
      debug.write(MessageType.Step, 'Checking unique key 2...');
      await checkUniqueKey(query, tableName, instanceName, uniqueKey2);
    }
    debug.write(MessageType.Step, 'Finding lookup...');
    const lookup = await lookupService.findOne(query, {
      lookup_uuid: row.lookup_uuid,
    });
    debug.write(MessageType.Step, 'Updating lookup value...');
    await updateRow(
      query,
      `${lookup.lookup_type}_lookup_values`,
      { lookup_code: row.lookup_code },
      updateData,
    );
    debug.write(MessageType.Step, 'Updating row...');
    updatedRow = (await updateRow(
      query,
      tableName,
      primaryKey,
      updateData,
      columnNames,
    )) as Row;
  }
  debug.write(MessageType.Exit, `updatedRow=${JSON.stringify(updatedRow)}`);
  return updatedRow;
};

export const delete_ = async (query: Query, primaryKey: PrimaryKey) => {
  const debug = new Debug(`${debugSource}.delete`);
  debug.write(MessageType.Entry, `primaryKey=${JSON.stringify(primaryKey)}`);
  debug.write(MessageType.Step, 'Finding row by primary key...');
  const row = (await findByPrimaryKey(
    query,
    tableName,
    instanceName,
    primaryKey,
    { forUpdate: true },
  )) as Row;
  debug.write(MessageType.Value, `row=${JSON.stringify(row)}`);
  debug.write(MessageType.Step, 'Finding lookup...');
  const lookup = await lookupService.findOne(query, {
    lookup_uuid: row.lookup_uuid,
  });
  debug.write(MessageType.Step, 'Deleting lookup value...');
  await deleteRow(query, `${lookup.lookup_type}_lookup_values`, {
    lookup_code: row.lookup_code,
  });
  debug.write(MessageType.Step, 'Deleting row...');
  await deleteRow(query, tableName, primaryKey);
  debug.write(MessageType.Exit);
};
