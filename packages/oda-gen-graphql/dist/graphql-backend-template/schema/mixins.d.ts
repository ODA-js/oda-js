import { ModelPackage, IMixin, FieldType } from 'oda-model';
export interface MapperOutput {
    name: string;
    fields: {
        name: string;
        description: string;
        type: string;
        args: string;
    }[];
}
export declare function mapper(entity: IMixin, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): MapperOutput;
//# sourceMappingURL=mixins.d.ts.map