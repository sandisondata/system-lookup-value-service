import { BaseService, Query } from 'base-service-class';
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
export declare class Service extends BaseService<PrimaryKey, CreateData, UpdateData, Row> {
    preCreate(): Promise<void>;
    preUpdate(): Promise<void>;
    preDelete(): Promise<void>;
    postCreate(): Promise<void>;
    postUpdate(): Promise<void>;
    postDelete(): Promise<void>;
}
