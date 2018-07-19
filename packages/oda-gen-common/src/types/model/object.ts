import { IResolvers, IEnumResolver } from 'graphql-tools';
import { merge } from 'lodash';

import {
  parse,
  print,
  DocumentNode,
  DefinitionNode,
  visit,
  TypeDefinitionNode,
  Kind,
  GraphQLScalarType,
} from 'graphql';

export type ResolverFunction = (
  owner,
  args,
  context,
  info,
) => Promise<any> | any;

export type ResolverHookFunction = (
  target: ResolverFunction,
) => ResolverFunction;

export type ResolverHook = { [key: string]: ResolverHookFunction };

function isResolverHook(inp): inp is ResolverHookFunction {
  return inp instanceof Function && inp.length > 0;
}

export type UnionInterfaceResolverFunction = (
  owner,
  context,
  info,
) => Promise<any> | any;

export type ScalarResolver = ScalarResolverType | GraphQLScalarType;
export type ScalarResolverType = {
  serialize: any;
  parseValue: any;
  parseLiteral: any;
};

export type EnumResolver = {
  [key: string]: IEnumResolver;
};

export type FieldDefinition = {
  name: string;
  description: string;
  type: any;
  resolve: ResolverFunction;
};

export enum ModelType {
  query = 'query',
  mutation = 'mutation',
  subscription = 'subscription',
  type = 'type',
  input = 'input',
  union = 'union',
  interface = 'interface',
  scalar = 'scalar',
  enum = 'enum',
  schema = 'schema',
  hook = 'hook',
}

export type ModelTypes = keyof typeof ModelType;

export type ObjectResolver = {
  [property: string]: ResolverFunction | FieldDefinition;
};

export type Resolver = {
  [entity: string]: ObjectResolver;
};

export function isIGQLInput(inp): inp is IGQLBaseInput {
  return (
    inp &&
    typeof inp === 'object' &&
    (inp.hasOwnProperty('schema') ||
      inp.hasOwnProperty('type') ||
      inp.hasOwnProperty('resolver'))
  );
}

export function isValidInput(
  inp: any,
): inp is IGQLBaseInput | IGQLInput | string | DocumentNode {
  if (isIGQLInput(inp)) {
    return isValidSchema(inp.schema) || inp.resolver || inp.type;
  } else if (typeof inp === 'object') {
    return isValidSchema(inp);
  } else if (typeof inp === 'string') {
    return isValidSchema(inp);
  } else {
    return false;
  }
}

export function isValidSchema(inp: any): inp is string | DocumentNode {
  if (typeof inp === 'object') {
    try {
      print(inp);
    } catch {
      return false;
    }
    return true;
  } else if (typeof inp === 'string') {
    try {
      parse(inp);
    } catch {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

export interface IGQLBaseInput<Resolver = any> {
  type?: ModelTypes;
  schema?: string | DocumentNode;
  resolver?: Resolver;
}

export interface IGQLInput<Resolver = any> extends IGQLBaseInput<Resolver> {
  type?: ModelTypes;
  schema: string | DocumentNode;
  resolver?: Resolver;
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

export abstract class GQLType<Resolver = any> implements Readonly<IGQLTypeDef> {
  static create(inp: IGQLInput | string | DocumentNode): GQLType | GQLType[] {
    if (isValidInput(inp)) {
      let schema, type: ModelTypes;
      if (isIGQLInput(inp)) {
        schema = inp.schema;
        type = inp.type;
      } else if (typeof inp === 'object') {
        schema = inp;
      } else if (typeof inp === 'string') {
        schema = parse(inp);
      }

      if (type) {
        if (isValidInput(inp)) {
          switch (type) {
            case 'enum':
              return new Enum(inp);
            case 'input':
              return new Input(inp);
            case 'interface':
              return new Interface(inp);
            case 'scalar':
              return new Scalar(inp);
            case 'union':
              return new Union(inp);
            case 'type':
              return new Type(inp);
            case 'query':
              return new Query(inp);
            case 'mutation':
              return new Mutation(inp);
            case 'subscription':
              return new Subscription(inp);
            case 'schema':
            default:
              throw new Error('unknown type');
          }
        }
      } else if (schema && isValidInput(inp)) {
        return schema.definitions.map(typedef => {
          switch (typedef.kind) {
            case Kind.ENUM_TYPE_DEFINITION:
            case Kind.ENUM_TYPE_EXTENSION:
              return new Enum(inp);
            case Kind.INPUT_OBJECT_TYPE_DEFINITION:
            case Kind.INPUT_OBJECT_TYPE_EXTENSION:
              return new Input(inp);
            case Kind.INTERFACE_TYPE_DEFINITION:
            case Kind.INTERFACE_TYPE_EXTENSION:
              return new Interface(inp);
            case Kind.SCALAR_TYPE_DEFINITION:
            case Kind.SCALAR_TYPE_EXTENSION:
              return new Scalar(inp);
            case Kind.UNION_TYPE_DEFINITION:
            case Kind.UNION_TYPE_EXTENSION:
              return new Union(inp);
            case Kind.OBJECT_TYPE_DEFINITION:
            case Kind.OBJECT_TYPE_EXTENSION: {
              if (typedef.name.value.match(/mutation/i)) {
                return new Mutation(inp);
              } else if (typedef.name.value.match(/query/i)) {
                return new Query(inp);
              } else if (typedef.name.value.match(/subscription/i)) {
                return new Subscription(inp);
              } else {
                return new Type(inp);
              }
            }
            default:
              throw new Error('unknown type');
          }
        });
      }
    } else if (isValidSchemaInput(inp)) {
      return new Schema(inp);
    } else {
      throw new Error('not valid input');
    }
  }
  public get isExtend(): boolean {
    return this._isExtend;
  }
  protected _isExtend: boolean;
  protected _type: ModelType;
  public get type(): ModelTypes {
    return this._type;
  }
  protected _name: string;
  public get name(): string {
    return this._name;
  }
  protected _schema: string;
  protected _schemaAST: DocumentNode;
  public get schema(): string {
    return this._schema;
  }
  public get schemaAST(): DocumentNode {
    return this._schemaAST;
  }
  protected _resolver?: any;
  public get resolver(): null | IResolvers {
    return this._resolver;
  }
  protected node: DefinitionNode[] | DefinitionNode;
  protected resolveName(schema: string | DocumentNode) {
    const parsed = typeof schema === 'string' ? parse(schema) : schema;
    return (parsed.definitions[0] as TypeDefinitionNode).name.value;
  }
  constructor(
    args: IGQLBaseInput<Resolver> | IGQLInput<Resolver> | string | DocumentNode,
  ) {
    if (isValidInput(args)) {
      if (isValidSchema(args)) {
        this.attachSchema(args);
        this._name = this.resolveName(args);
      } else {
        this.attachSchema(args.schema);
        this.attachResolver(args.resolver);
        this._name = this.resolveName(args.schema);
      }
    }
  }
  public attachResolver(resolver: Resolver) {
    this._resolver = resolver;
  }
  public attachSchema(value: string | DocumentNode) {
    if (isValidSchema(value)) {
      if (typeof value === 'string') {
        this._schema = value;
        this._schemaAST = parse(value);
      } else {
        this._schemaAST = value;
        this._schema = print(value);
      }
    }
  }
  public get valid(): boolean {
    return !!this._schema && !!this._name;
  }
}

export class Fields<Resolver> extends GQLType<Resolver>
  implements Readonly<IGQLTypeDef> {
  protected _rootName: string;
  protected resolveName(schema: string | DocumentNode) {
    const parsed = typeof schema === 'string' ? parse(schema) : schema;
    let name;
    visit(parsed, {
      [Kind.FIELD_DEFINITION](node) {
        name = node.name.value;
      },
    });
    return name;
  }
  protected resolveRootName(schema: string | DocumentNode) {
    const parsed = typeof schema === 'string' ? parse(schema) : schema;
    let rootName;
    visit(parsed, {
      [Kind.OBJECT_TYPE_DEFINITION](node) {
        rootName = node.name.value;
      },
      [Kind.OBJECT_TYPE_EXTENSION](node) {
        rootName = node.name.value;
      },
    });
    return rootName;
  }
  constructor(args) {
    super(args);
    this._rootName = this.resolveRootName(this._schemaAST);
  }
  public get resolver() {
    return this._rootName && this._resolver
      ? { [this._rootName]: this._resolver }
      : undefined;
  }
}

export class Query extends Fields<ResolverFunction>
  implements Readonly<IGQLTypeDef> {
  constructor(args: IGQLInput<ResolverFunction> | string | DocumentNode) {
    super(args);
    this._type = ModelType.query;
  }
}

export class Mutation extends Fields<ResolverFunction>
  implements Readonly<IGQLTypeDef> {
  constructor(args: IGQLInput<ResolverFunction> | string | DocumentNode) {
    super(args);
    this._type = ModelType.mutation;
  }
}

export type SubscriptionResolver = {
  subscribe: ResolverFunction;
  resolve?: (payload) => any;
};

export class Subscription extends Fields<SubscriptionResolver>
  implements Readonly<IGQLTypeDef> {
  constructor(args: IGQLInput<SubscriptionResolver> | string | DocumentNode) {
    super(args);
    this._type = ModelType.subscription;
  }
}

export class Type extends GQLType<ResolverFunction | ObjectResolver>
  implements Readonly<IGQLTypeDef> {
  public resolveExtend(schema: string | DocumentNode) {
    const parsed = typeof schema === 'string' ? parse(schema) : schema;
    let extend = false;
    visit(parsed, {
      [Kind.OBJECT_TYPE_EXTENSION](node) {
        extend = true;
      },
    });
    return extend;
  }
  constructor(
    args: IGQLInput<ResolverFunction | ObjectResolver> | string | DocumentNode,
  ) {
    super(args);
    this._type = ModelType.type;
    this._isExtend = this.resolveExtend(this._schemaAST);
  }
  public get resolver() {
    return this.name ? { [this.name]: this._resolver } : undefined;
  }
}

export class Input extends GQLType implements Readonly<IGQLTypeDef> {
  constructor(args: IGQLInput | string | DocumentNode) {
    super(args);
    this._type = ModelType.input;
  }
}

export class Union extends GQLType<UnionInterfaceResolverFunction>
  implements Readonly<IGQLTypeDef> {
  constructor(
    args: IGQLInput<UnionInterfaceResolverFunction> | string | DocumentNode,
  ) {
    super(args);
    this._type = ModelType.union;
  }
  public get resolver() {
    return this._resolver
      ? {
          [this.name]: {
            __resolveType: this._resolver,
          },
        }
      : {
          [this.name]: {
            __resolveType: () => null,
          },
        };
  }
}

export class Interface extends GQLType<UnionInterfaceResolverFunction>
  implements Readonly<IGQLTypeDef> {
  constructor(
    args: IGQLInput<UnionInterfaceResolverFunction> | string | DocumentNode,
  ) {
    super(args);
    this._type = ModelType.interface;
  }
  public get resolver() {
    return this._resolver
      ? {
          [this.name]: {
            __resolveType: this._resolver,
          },
        }
      : {
          [this.name]: {
            __resolveType: () => null,
          },
        };
  }
}

function isCustomScalar(inp): inp is ScalarResolverType {
  return (
    typeof inp === 'object' &&
    (inp.hasOwnProperty('serialize') ||
      inp.hasOwnProperty('parseValue') ||
      inp.hasOwnProperty('parseLiteral'))
  );
}

export class Scalar extends GQLType<ScalarResolver>
  implements Readonly<IGQLTypeDef> {
  constructor(args: IGQLInput<ScalarResolver> | string | DocumentNode) {
    super(args);
    this._type = ModelType.scalar;
    if (isCustomScalar(args)) {
      this._resolver = new GraphQLScalarType({
        name: this.name,
        serialize: args.serialize,
        parseLiteral: args.parseLiteral,
        parseValue: args.parseLiteral,
        astNode: this._schemaAST as any,
      });
    }
  }
  public get resolver() {
    return this.name ? { [this.name]: this._resolver } : undefined;
  }
}

export class Enum extends GQLType<IEnumResolver>
  implements Readonly<IGQLTypeDef> {
  public get resolver(): IResolvers {
    return this.name ? { [this.name]: this._resolver } : undefined;
  }
  constructor(args: IGQLInput<IEnumResolver> | string | DocumentNode) {
    super(args);
    this._type = ModelType.enum;
  }
}

type PossibleInitType = GQLType | IGQLInput | string | DocumentNode;

export type SchemaInit = void | PossibleInitType | PossibleInitType[];

function isValidSchemaInput(inp: any): inp is SchemaInput {
  if (typeof inp === 'string') {
    return true;
  }
  if (typeof inp === 'object' && inp.hasOwnProperty('name')) {
    return true;
  }
}

export interface SchemaInput extends IGQLBaseInput<IResolvers> {
  name: string;
  items?: SchemaInit;
  hooks?: ResolverHook[] | ResolverHook;
  rootQuery?: string;
  rootMutation?: string;
  rootSubscription?: string;
}

export class Schema extends GQLType<IResolvers> implements IGQLTypeDef {
  /**
   * store Query entries after build
   */
  public get queries(): Query[] {
    return this._queries;
  }
  /**
   * store Mutation entries after build
   */
  public get mutations(): Mutation[] {
    return this._mutations;
  }

  /**
   * store Subscription entries after build
   */
  public get subscriptions(): Subscription[] {
    return this._subscriptions;
  }
  /**
   * store all Items
   */
  public get items(): GQLType[] {
    return this._items;
  }

  protected _compiledHooks: ResolverHook[];
  protected _hooks: ResolverHook[] = [];
  public get hooks(): ResolverHook[] {
    return this._hooks;
  }
  /**
   * initial resolvers
   */
  public get resolvers(): IResolvers {
    return this._resolvers;
  }
  protected _resolvers: IResolvers;
  /**
   * All entries for this schema
   * note: available after schema is built
   */
  protected _items: GQLType[] = [];
  /**
   * All queries for schema
   * note: available after schema is built
   */
  protected _queries: Query[];
  /**
   * All mutations for schema
   * note: available after schema is built
   */
  protected _mutations: Mutation[];
  /**
   * All subscriptions for schema.
   * note: available after schema is built
   */
  protected _subscriptions: Subscription[];
  /**
   * create item
   * @param inp the item must be
   */
  public create(inp: PossibleInitType): GQLType | GQLType[] {
    if (isValidInput(inp)) {
      return GQLType.create(inp);
    } else {
      return inp;
    }
  }
  /**
   * add existing item to schema
   * @param inp
   */
  public add(inp: GQLType | GQLType[]) {
    if (Array.isArray(inp)) {
      return inp.map(i => {
        return this.add(i);
      });
    } else {
      if (!~this._items.indexOf(inp)) {
        this._items.push(inp);
        return inp;
      }
    }
  }
  /**
   * check is schema build
   */
  protected _isBuilt: boolean = false;
  public get isBuilt(): boolean {
    return this._isBuilt;
  }

  /**
   * build schema
   */
  public build() {
    this._items
      .filter(i => i instanceof Schema)
      .forEach(i => (i as Schema).build());
    this._schema = [...this._items.map(i => i.schema), this._initialSchema]
      .filter(i => i)
      .join('\n');
    this._schemaAST = parse(this._schema);

    this._resolvers = merge(
      {},
      this._resolver,
      ...this._items
        .filter(i => !(i instanceof Schema))
        .map(i => i.resolver)
        .filter(i => i),
      ...this._items
        .filter(i => i instanceof Schema)
        .map(i => (i as Schema).resolvers)
        .filter(i => i),
    );

    this._compiledHooks = this._items
      .filter(r => r.type === ModelType.schema)
      .map(r => (r as Schema).hooks)
      .reduce((res, curr) => {
        res.push(...curr);
        return res;
      }, []);
    this._isBuilt = true;
  }

  protected _initialSchema: string;
  public get schema(): string {
    return this._isBuilt ? this._schema : '';
  }

  protected _rootQuery?: string = 'RootQuery';
  protected _rootMutation?: string = 'RootMutation';
  protected _rootSubscription?: string = 'RootSubscription';
  /**
   * override inherited
   */
  protected resolveName() {
    return '';
  }
  constructor(args: SchemaInput | string) {
    super(args);
    this._type = ModelType.schema;
    if (args && typeof args === 'string') {
      this._name = args;
    }
    if (args && typeof args !== 'string') {
      const {
        name,
        items,
        rootMutation,
        rootQuery,
        rootSubscription,
        hooks,
        schema,
      } = args;
      if (schema) {
        this._initialSchema = this._schema;
      }
      if (name) {
        this._name = name;
      }
      if (rootMutation) {
        this._rootMutation = rootMutation;
      }
      if (rootQuery) {
        this._rootQuery = rootQuery;
      }
      if (rootSubscription) {
        this._rootSubscription = rootSubscription;
      }
      if (items) {
        if (Array.isArray(items)) {
          items.forEach(item => {
            this.add(this.create(item));
          });
        } else {
          this.add(this.create(items));
        }
      }
      if (hooks) {
        if (Array.isArray(hooks)) {
          this._hooks.push(...hooks);
        } else if (isResolverHook(hooks)) {
          this._hooks.push(hooks);
        }
      }
    }
  }
  public get valid(): boolean {
    return true;
  }
}
