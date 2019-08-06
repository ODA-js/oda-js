import { DocumentNode } from 'graphql';
export declare function graphqlLodash(query: string | DocumentNode, operationName?: string): {
    apply: boolean;
    query: DocumentNode;
    transform: (data: any) => any;
    queryShape: {};
    reshape: {};
};
//# sourceMappingURL=gql.d.ts.map