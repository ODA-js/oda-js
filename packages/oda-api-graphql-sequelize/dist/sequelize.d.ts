import { ConnectorsApiBase, SecurityContext } from 'oda-api-graphql';
import Sequelize from 'sequelize';
export default class SequelizeApi<RegisterConnectors, Payload extends object> extends ConnectorsApiBase<RegisterConnectors, Payload> {
    sequelize: Sequelize.Sequelize;
    constructor({ sequelize, connectors, name, securityContext, }: {
        sequelize: any;
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
    ensureId(obj: any): Payload;
    protected _getList(args: any, checkExtraCriteria?: any): Promise<any[]>;
    protected _create(obj: Payload): Promise<any>;
    protected _update(record: any, obj: Payload): Promise<any>;
    protected _remove(record: any): Promise<any>;
    sync({ force }: {
        force?: boolean;
    }): Promise<void>;
}
//# sourceMappingURL=sequelize.d.ts.map