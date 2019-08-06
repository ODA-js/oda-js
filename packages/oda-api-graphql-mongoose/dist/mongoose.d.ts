import { ConnectorsApiBase, SecurityContext, RegisterConnectorsBase } from 'oda-api-graphql';
export declare class FilterMongoose {
    static parse(node: any, idMap?: {
        id: string;
    }, id?: boolean): any;
}
export default class MongooseApi<RegisterConnectors extends RegisterConnectorsBase, Payload extends object> extends ConnectorsApiBase<RegisterConnectors, Payload> {
    mongoose: any;
    constructor({ mongoose, connectors, name, securityContext, }: {
        mongoose: any;
        name: string;
        connectors: RegisterConnectors;
        securityContext: SecurityContext<RegisterConnectors>;
    });
    protected initSchema(name: any, schema: any): void;
    getCount(args: any): Promise<any>;
    getFilter(args: {
        filter: any;
        idMap: any;
    }): any;
    toJSON(obj: any): Payload;
    ensureId(obj: any): Payload;
    protected _getList(args: any, checkExtraCriteria?: any): Promise<any[]>;
    protected _create(obj: Payload): Promise<any>;
    protected _update(record: any, obj: Payload): Promise<any>;
    protected _remove(record: any): Promise<any>;
    sync({ force }: {
        force?: boolean;
    }): Promise<void>;
}
//# sourceMappingURL=mongoose.d.ts.map