import { Query } from 'database';
import * as lookupService from 'repository-lookup-service';
export type PrimaryKey = {
    uuid?: string;
};
export type Lookup<Populate extends boolean = false> = Populate extends false ? {
    lookup_uuid: string;
} : {
    lookup: lookupService.Row;
};
export type LookupValue = {
    lookup_code: string;
    meaning: string;
    description?: string | null;
    is_enabled?: boolean;
};
export type Data<Populate extends boolean = false> = Lookup<Populate> & LookupValue;
export type CreateData = PrimaryKey & Data;
export type CreatedRow = Row<true>;
export type Row<Populate extends boolean = false> = Required<PrimaryKey> & Required<Data<Populate>>;
export type UpdateData = Partial<Data>;
export type UpdatedRow = Row;
export declare const create: (query: Query, createData: CreateData) => Promise<CreatedRow>;
export declare const find: (query: Query) => Promise<Row<false>[]>;
export declare const findOne: (query: Query, primaryKey: PrimaryKey) => Promise<Row<false>>;
export declare const update: (query: Query, primaryKey: PrimaryKey, updateData: UpdateData) => Promise<UpdatedRow>;
export declare const delete_: (query: Query, primaryKey: PrimaryKey) => Promise<void>;
