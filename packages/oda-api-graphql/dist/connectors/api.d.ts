import { ACLCRUD } from '../acl/secureAny';
import { CRUD } from './../connector';
export declare type ACLCheck = (context: any, obj: {
    source?: any;
    payload?: any;
}) => object;
export declare type SecurityContext<Connectors> = {
    [key: string]: any;
    acls: ACLCRUD<(context: SecurityContext<Connectors>, obj: {
        source?: any;
        payload?: object;
    }) => object | Promise<any>>;
    group: string;
};
export default class ConnectorsApiBase<Connectors, Payload extends object> {
    name: string;
    protected securityContext: SecurityContext<Connectors>;
    schema: any;
    model: any;
    connectors: Connectors;
    loaders: any;
    updaters: any;
    loaderKeys: any;
    storeToCache: any;
    constructor({ name, connectors, securityContext, }: {
        name: string;
        connectors: Connectors;
        securityContext: SecurityContext<Connectors>;
    });
    toJSON(obj: any): Payload;
    secure(action: CRUD, obj: {
        source?: any;
        payload?: Payload;
    }): Payload;
    protected _defaultAccess(context: ConnectorsApiBase<Connectors, Payload>, obj: {
        source?: any;
        payload?: Payload;
    }): object;
    protected _defaultCreate(context: ConnectorsApiBase<Connectors, Payload>, obj: {
        source?: any;
        payload?: Payload;
    }): object;
    protected _getList(args: any, checkExtraCriteria?: any): Promise<any[]>;
    getList(args: any, checkExtraCriteria?: any): Promise<any[]>;
    readSecure(source?: Payload): Promise<Payload>;
    createSecure(payload?: Payload): Promise<any>;
    protected _create(payload: Payload): Promise<any>;
    updateSecure(source?: any, payload?: Payload): Promise<any>;
    protected _update(source: any, payload: Payload): Promise<any>;
    removeSecure(source?: any): Promise<any>;
    protected _remove(record: any): Promise<any>;
    getPayload(args: any): Payload;
    protected initSchema(name: any, schema: any): void;
    updateLoaders(name: string): (items: any) => any;
    getCount(args: any): Promise<Number>;
    ensureId(obj: Payload): Payload;
    findOneById(id: any): Promise<Payload>;
    sync({ force }: {
        force?: boolean;
    }): Promise<void>;
}
//# sourceMappingURL=api.d.ts.map