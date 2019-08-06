import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import * as schema from './index';
import { FieldType } from 'oda-model';
export declare const template = "entity/type.index.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    partials: {
        enums: schema.type.enums.MapperOutput;
        type: schema.type.entry.MapperOutput;
        'connections.types': schema.connections.types.MapperOutput;
        'connections.mutation': schema.connections.mutations.types.MapperOutput;
        'connections.mutation.entry': schema.connections.mutations.entry.MapperOutput;
        'mutation.types': schema.mutations.types.MapperOutput;
        'mutation.entry': schema.mutations.entry.MapperOutput;
        'subscription.types': schema.subscriptions.types.MapperOutput;
        'subscription.entry': schema.subscriptions.entry.MapperOutput;
        'query.entry': schema.query.entry.MapperOutput;
        'viewer.entry': schema.viewer.entry.MapperOutput;
    };
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=type.index.ts.d.ts.map