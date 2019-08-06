import { ModelPackage, FieldType } from 'oda-model';
export declare const template = "schema/package";
export declare function prepare(pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): {
    ctx: MapperOutput;
    template: string;
};
export interface MapperOutput {
    name: string;
    entities: {
        name: string;
    }[];
    scalars: {
        name: string;
    }[];
    directives: {
        name: string;
    }[];
    enums: {
        name: string;
    }[];
    mutations: MutationQueryOutput[];
    queries: MutationQueryOutput[];
    unions: {
        name: string;
        items: string[];
    }[];
    mixins: {
        name: string;
        fields: any[];
    }[];
}
import { MutationQueryOutput } from './mutation-query';
export declare function mapper(pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): MapperOutput;
//# sourceMappingURL=package.d.ts.map