import { GraphQLNonNull } from 'graphql';
export declare function globalIdField(typeName?: string, idFetcher?: (object: any, context: any, info: any) => string): {
    name: string;
    description: string;
    type: GraphQLNonNull<import("graphql").GraphQLNullableType>;
    resolve: (obj: any, args: any, context: any, info: any) => string;
};
//# sourceMappingURL=globalId.d.ts.map