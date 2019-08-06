import { IResolvers } from 'graphql-tools';
import { OrderedMap } from 'immutable';
export declare class GQLModule {
    readonly name: string;
    readonly resolver: {
        [key: string]: any;
    };
    readonly query: {
        [key: string]: any;
    };
    readonly viewer: {
        [key: string]: any;
    };
    readonly mutation: {
        [key: string]: any;
    };
    readonly subscription: {
        [key: string]: any;
    };
    readonly typeDef: string[];
    readonly mutationEntry: string[];
    readonly subscriptionEntry: string[];
    readonly queryEntry: string[];
    readonly viewerEntry: string[];
    readonly hooks: {
        [key: string]: any;
    }[];
    protected _name: string;
    protected _resolver: {
        [key: string]: any;
    };
    protected _query: {
        [key: string]: any;
    };
    protected _viewer: {
        [key: string]: any;
    };
    protected _mutation: {
        [key: string]: any;
    };
    protected _subscription: {
        [key: string]: any;
    };
    protected _typeDef: {
        [key: string]: string[];
    };
    protected _mutationEntry: {
        [key: string]: string[];
    };
    protected _subscriptionEntry: {
        [key: string]: string[];
    };
    protected _queryEntry: {
        [key: string]: string[];
    };
    protected _viewerEntry: {
        [key: string]: string[];
    };
    protected _hooks: {
        [key: string]: any;
    }[];
    protected _extend: GQLModule[];
    protected _composite: GQLModule[];
    protected _extendsOf: OrderedMap<string, GQLModule>;
    protected _compositeOf: OrderedMap<string, GQLModule>;
    applyHooks(obj: IResolvers): IResolvers;
    constructor({ name, resolver, query, viewer, typeDef, mutationEntry, subscriptionEntry, queryEntry, viewerEntry, mutation, subscription, hooks, extend, composite, }: {
        name?: string;
        resolver?: {
            [key: string]: any;
        };
        query?: {
            [key: string]: any;
        };
        viewer?: {
            [key: string]: any;
        };
        mutation?: {
            [key: string]: any;
        };
        subscription?: {
            [key: string]: any;
        };
        typeDef?: {
            [key: string]: string[];
        };
        mutationEntry?: {
            [key: string]: string[];
        };
        subscriptionEntry?: {
            [key: string]: string[];
        };
        queryEntry?: {
            [key: string]: string[];
        };
        viewerEntry?: {
            [key: string]: string[];
        };
        hooks?: {
            [key: string]: any;
        }[];
        extend?: GQLModule[];
        composite?: GQLModule[];
    });
    discoverExtendsOf(extendees: OrderedMap<string, GQLModule>): OrderedMap<string, GQLModule>;
    discoverCompositeOf(composees: OrderedMap<string, GQLModule>): OrderedMap<string, GQLModule>;
    build(): void;
    private compose;
    private extend;
    private override;
}
//# sourceMappingURL=empty.d.ts.map