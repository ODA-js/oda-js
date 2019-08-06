import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
import { mapper } from './common';
export declare const template = "entity/UI/queries.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export { mapper };
//# sourceMappingURL=queries.ts.d.ts.map