import { Query } from 'database';
import * as lookupService from 'repository-lookup-service';
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
export type CreatedRow = Required<PrimaryKey> & {
    lookup: lookupService.Row;
} & Omit<Required<Data>, 'lookup_uuid'>;
export type Row = Required<PrimaryKey> & Required<Data>;
export type UpdateData = Partial<Data>;
export type UpdatedRow = Row;
export declare const create: (query: Query, createData: CreateData) => Promise<CreatedRow>;
export declare const find: (query: Query) => Promise<Row[]>;
export declare const findOne: (query: Query, primaryKey: PrimaryKey) => Promise<Row>;
export declare const update: (query: Query, primaryKey: PrimaryKey, updateData: UpdateData) => Promise<UpdatedRow>;
export declare const delete_: (query: Query, primaryKey: PrimaryKey) => Promise<void>;
