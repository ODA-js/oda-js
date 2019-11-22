import { types } from 'oda-gen-common';
export declare class Path extends types.GQLModule {
    protected _name: string;
    protected _resolver: {
        [key: string]: any;
    };
    protected _typeDef: {
        type: string[];
    };
}
export declare class RegularExpression extends types.GQLModule {
    protected _name: string;
    protected _typeDef: {
        type: string[];
    };
}
export declare class Predicate extends types.GQLModule {
    protected _name: string;
    protected _typeDef: {
        type: string[];
    };
}
export declare class DirectiveLodash extends types.GQLModule {
    protected _name: string;
    protected _typeDef: {
        type: string[];
    };
}
export declare class LodashOperations extends types.GQLModule {
    protected _name: string;
    protected _typeDef: {
        type: string[];
    };
}
export declare class DummyArgument extends types.GQLModule {
    protected _name: string;
    protected _typeDef: {
        type: string[];
    };
}
export declare class ConvertTypeArgument extends types.GQLModule {
    protected _name: string;
    protected _typeDef: {
        type: string[];
    };
}
export declare class LodashModule extends types.GQLModule {
    protected _name: string;
    protected _composite: (Path | RegularExpression | Predicate | DirectiveLodash | LodashOperations | DummyArgument | ConvertTypeArgument)[];
}
//# sourceMappingURL=lodash.d.ts.map