import { IResolvers, IEnumResolver } from 'graphql-tools';
import { DocumentNode, DefinitionNode, GraphQLScalarType } from 'graphql';
export declare type ResolverFunction = (owner: any, args: any, context: any, info: any) => Promise<any> | any;
export declare type ResolverHookFunction = (target: ResolverFunction | IResolvers) => ResolverFunction;
export declare type ResolverHook = {
    [key: string]: ResolverHookFunction;
};
export declare type UnionInterfaceResolverFunction = (owner: any, context: any, info: any) => Promise<any> | any;
export declare type ScalarResolver = ScalarResolverType | GraphQLScalarType;
export declare type ScalarResolverType = {
    serialize?: any;
    parseValue?: any;
    parseLiteral?: any;
};
export declare type EnumResolver = {
    [key: string]: IEnumResolver;
};
export declare type FieldDefinition = {
    name: string;
    description: string;
    type: any;
    resolve: ResolverFunction;
};
export declare enum ModelType {
    query = "query",
    directive = "directive",
    mutation = "mutation",
    subscription = "subscription",
    type = "type",
    input = "input",
    union = "union",
    interface = "interface",
    scalar = "scalar",
    enum = "enum",
    schema = "schema",
    hook = "hook"
}
export declare type ModelTypes = keyof typeof ModelType;
export declare type ObjectResolver = {
    [property: string]: ResolverFunction | FieldDefinition;
};
export declare type Resolver = {
    [entity: string]: ObjectResolver;
};
export declare function isIGQLInput(inp: any): inp is IGQLBaseInput;
export declare function isValidInput(inp: any): inp is IGQLBaseInput | IGQLInput | string | DocumentNode;
export declare function isValidSchema(inp: any): inp is string | DocumentNode;
export interface IGQLBaseInput<Reslvr = any> {
    type?: ModelTypes;
    schema?: string | DocumentNode;
    resolver?: Reslvr;
}
export interface IGQLInput<Reslvr = any> extends IGQLBaseInput<Reslvr> {
    type?: ModelTypes;
    schema: string | DocumentNode;
    resolver?: Reslvr;
}
export interface IGQLType {
    type: ModelTypes;
    schema: string;
    schemaAST: DocumentNode;
    name?: string;
    isExtend: boolean;
}
export interface IGQLTypeDef extends IGQLType {
    type: ModelTypes;
    resolver?: IResolvers;
}
export declare abstract class GQLType<Reslvr = any> implements Readonly<IGQLTypeDef> {
    readonly isExtend: boolean;
    readonly type: ModelTypes;
    readonly name: string;
    readonly schema: string;
    readonly schemaAST: DocumentNode;
    readonly resolver: undefined | IResolvers;
    readonly valid: boolean;
    complex: boolean;
    protected _isExtend: boolean;
    protected _type: ModelType;
    protected _name: string;
    protected _schema: string;
    protected _schemaAST: DocumentNode;
    protected _resolver?: any;
    protected node: DefinitionNode[] | DefinitionNode;
    static create(inp: IGQLInput | string | DocumentNode): GQLType | GQLType[] | any;
    protected resolveName(schema: string | DocumentNode | undefined): string;
    constructor(args: IGQLBaseInput<Reslvr> | IGQLInput<Reslvr> | string | DocumentNode);
    attachResolver(resolver: Reslvr | undefined): void;
    checkSchema(): void;
    attachSchema(value: string | DocumentNode | undefined): void;
}
export declare class Directive extends GQLType {
    constructor(args: any);
}
export declare class Fields<Reslvr> extends GQLType<Reslvr> implements Readonly<IGQLTypeDef> {
    protected _rootName: string;
    protected resolveName(schema: string | DocumentNode): any;
    protected resolveRootName(schema: string | DocumentNode): any;
    constructor(args: any);
    readonly resolver: {
        [x: string]: {
            [x: string]: any;
        };
    };
}
export declare class Query extends Fields<ResolverFunction> implements Readonly<IGQLTypeDef> {
    constructor(args: IGQLInput<ResolverFunction> | string | DocumentNode);
}
export declare class Mutation extends Fields<ResolverFunction> implements Readonly<IGQLTypeDef> {
    constructor(args: IGQLInput<ResolverFunction> | string | DocumentNode);
}
export declare type SubscriptionResolver = {
    [key: string]: {
        resolve?: (payload: any) => any;
    } | ResolverFunction;
    subscribe: ResolverFunction;
};
export declare class Subscription extends Fields<SubscriptionResolver> implements Readonly<IGQLTypeDef> {
    constructor(args: IGQLInput<SubscriptionResolver> | string | DocumentNode);
}
export declare class Type extends GQLType<ResolverFunction | ObjectResolver> implements Readonly<IGQLTypeDef> {
    resolveExtend(schema: string | DocumentNode): boolean;
    constructor(args: IGQLInput<ResolverFunction | ObjectResolver> | string | DocumentNode);
    readonly resolver: {
        [x: string]: any;
    };
}
export declare class Input extends GQLType implements Readonly<IGQLTypeDef> {
    constructor(args: IGQLInput | string | DocumentNode);
}
export declare class Union extends GQLType<UnionInterfaceResolverFunction> implements Readonly<IGQLTypeDef> {
    constructor(args: IGQLInput<UnionInterfaceResolverFunction> | string | DocumentNode);
    readonly resolver: {
        [x: string]: {
            __resolveType: any;
        };
    };
}
export declare class Interface extends GQLType<UnionInterfaceResolverFunction> implements Readonly<IGQLTypeDef> {
    constructor(args: IGQLInput<UnionInterfaceResolverFunction> | string | DocumentNode);
    readonly resolver: {
        [x: string]: {
            __resolveType: any;
        };
    };
}
export declare class Scalar extends GQLType<ScalarResolver> implements Readonly<IGQLTypeDef> {
    constructor(args: IGQLInput<ScalarResolver> | string | DocumentNode);
    readonly resolver: {
        [x: string]: any;
    };
}
export declare class Enum extends GQLType<IEnumResolver> implements Readonly<IGQLTypeDef> {
    readonly resolver: IResolvers | undefined;
    constructor(args: IGQLInput<IEnumResolver> | string | DocumentNode);
}
export declare type PossibleInitType = GQLType | IGQLInput | string | DocumentNode;
export declare type SchemaInit = void | PossibleInitType | PossibleInitType[];
export interface SchemaInput extends IGQLBaseInput<IResolvers> {
    name: string;
    items?: SchemaInit;
    hooks?: ResolverHook[] | ResolverHook;
    rootQuery?: string;
    rootMutation?: string;
    rootSubscription?: string;
}
export declare class Schema extends GQLType<IResolvers> implements IGQLTypeDef {
    complex: boolean;
    readonly queries: Query[];
    readonly mutations: Mutation[];
    readonly subscriptions: Subscription[];
    readonly items: GQLType[];
    readonly hooks: ResolverHook[];
    readonly resolvers: IResolvers;
    readonly isBuilt: boolean;
    readonly valid: boolean;
    readonly schema: string;
    protected _compiledHooks: ResolverHook[];
    protected _hooks: ResolverHook[];
    protected _resolversClean: IResolvers;
    protected _resolvers: IResolvers;
    protected _items: GQLType[];
    protected _queries: Query[];
    protected _mutations: Mutation[];
    protected _subscriptions: Subscription[];
    protected _isBuilt: boolean;
    protected _initialSchema: string;
    protected _rootQuery?: string;
    protected _rootMutation?: string;
    protected _rootSubscription?: string;
    create(inp: PossibleInitType): GQLType | GQLType[] | undefined;
    add(inp: GQLType | GQLType[] | undefined): any;
    build(force?: boolean): void;
    resolveName(): string;
    constructor(args: SchemaInput | string);
    applyHooks(): void;
    fixSchema(): void;
}
//# sourceMappingURL=index.d.ts.map