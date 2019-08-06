export declare type CRUD = 'create' | 'read' | 'update' | 'remove';
export interface Connector<T> {
    create: (org: T) => Promise<T>;
    findOneById: (id: any) => Promise<T>;
    findOneByIdAndUpdate: (id: any, payload: T) => Promise<T>;
    findOneByIdAndRemove: (id: any) => Promise<T>;
    secure: (action: CRUD, obj: {
        payload: T;
        source: any;
    }) => T;
    getPayload: (obj: any, update?: boolean) => T;
    getCount: (args: any) => Promise<Number>;
    getList: (args: any, checkExtraCriteria?: any) => Promise<T[]>;
    sync: (args: {
        force?: boolean;
    }) => Promise<void>;
    ensureId(obj: T): T;
}
export declare class RegisterConnectorsBase {
    mongoose: any;
    sequelize: any;
    transaction: {
        commit: () => Promise<void>;
        abort: () => Promise<void>;
        session: {
            mongoose: any;
            sequelize: any;
        };
    };
    ensureTransaction(options?: any): Promise<boolean>;
}
//# sourceMappingURL=connector.d.ts.map