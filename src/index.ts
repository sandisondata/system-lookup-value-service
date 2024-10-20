import { Service } from './class';

export const service = new Service(
  'system-lookup-value-service',
  '_lookup_values',
  ['uuid'],
  ['lookup_uuid', 'lookup_code', 'meaning', 'description', 'is_enabled'],
  false,
);

export { CreateData, PrimaryKey, Row, UpdateData } from './class';
