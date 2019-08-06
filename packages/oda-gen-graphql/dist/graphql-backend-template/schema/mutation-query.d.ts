import { ModelPackage, FieldArgs, FieldType } from 'oda-model';
export interface MutationInput {
    name: string;
    description: string;
    args: FieldArgs[];
    payload: FieldArgs[];
}
export interface MutationQueryOutput {
    name: string;
    args: {
        name: string;
        type: {
            ts: string;
            gql: string;
        };
    }[];
    payload: {
        name: string;
        type: {
            ts: string;
            gql: string;
        };
    }[];
}
export declare function mapper(mutation: MutationInput, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MutationQueryOutput;
//# sourceMappingURL=mutation-query.d.ts.map