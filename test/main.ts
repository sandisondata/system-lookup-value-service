import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Database } from 'database';
import { Debug, MessageType } from 'node-debug';
import { Row as Lookup, service as lookupService } from 'system-lookup-service';
import { service } from '../dist';

describe('main', (suiteContext) => {
  Debug.initialize(true);
  let database: Database;
  let lookup: Lookup;
  let uuid: string;

  before(async () => {
    const debug = new Debug(`${suiteContext.name}.before`);
    debug.write(MessageType.Entry);
    database = Database.getInstance();
    lookup = await lookupService.create(database.query, {
      lookup_type: 'status',
      meaning: 'Status meaning',
      description: 'Status description',
    });
    debug.write(MessageType.Exit);
  });

  it('create', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      const row = await service.create(query, {
        lookup_uuid: lookup.uuid,
        lookup_code: 'open',
        meaning: 'Open meaning',
        description: 'Open description',
      });
      uuid = row.uuid;
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });

  it('find', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await service.find(database.query);
    debug.write(MessageType.Exit);
    assert.ok(true);
  });

  it('findOne', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await service.findOne(database.query, { uuid: uuid });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });

  it('update', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await service.update(
        query,
        { uuid: uuid },
        { lookup_code: 'open2', description: null },
      );
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });

  it('delete', async (testContext) => {
    const debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    await database.transaction(async (query) => {
      await service.delete(query, { uuid: uuid });
    });
    debug.write(MessageType.Exit);
    assert.ok(true);
  });

  after(async () => {
    const debug = new Debug(`${suiteContext.name}.after`);
    debug.write(MessageType.Entry);
    await lookupService.delete(database.query, { uuid: lookup.uuid });
    await database.disconnect();
    debug.write(MessageType.Exit);
  });
});
