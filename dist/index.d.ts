import { Query } from 'database';
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
export declare const create: (query: Query, createData: CreateData) => Promise<Row>;
export declare const find: (query: Query) => Promise<Row[]>;
export declare const findOne: (query: Query, primaryKey: PrimaryKey) => Promise<Row>;
export declare const update: (query: Query, primaryKey: PrimaryKey, updateData: UpdateData) => Promise<Row>;
export declare const delete_: (query: Query, primaryKey: PrimaryKey) => Promise<void>;
