import {
  parse,
  print,
  DocumentNode,
  DefinitionNode,
  visit,
  TypeDefinitionNode,
  Kind,
} from 'graphql';

export type ResolverFunction = (
  owner,
  args,
  context,
  info,
) => Promise<any> | any;

export type UnionInterfaceResolverFunction = (
  owner,
  context,
  info,
) => Promise<any> | any;

export type ScalarResolver = {
  serialize: any;
  parseValue: any;
  parseLiteral: any;
};

export type EnumResolverInput = {
  [key: string]: number | string;
};

export type EnumResolver = {
  [key: string]: EnumResolverInput;
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
  type = 'type',
  input = 'input',
  union = 'union',
  interface = 'interface',
  scalar = 'scalar',
  enum = 'enum',
}

export type ModelTypes = keyof typeof ModelType;

export type ObjectResolver = {
  [property: string]: ResolverFunction | FieldDefinition;
};

export type Resolver = {
  [entity: string]: ObjectResolver;
};

export function isIGQLInput(inp): inp is IGQLInput {
  return inp && typeof inp === 'object' && inp.hasOwnProperty('schema');
}

export function isValidInput(
  inp: any,
): inp is IGQLInput | string | DocumentNode {
  if (isIGQLInput(inp)) {
    return isValidSchema(inp.schema);
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

export interface IGQLInput<Resolver = any> {
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

export interface IGQLTypeDef<Resolver = any> extends IGQLType {
  type: ModelTypes;
  resolver?: Resolver;
}

export abstract class GQLType<Resolver = any>
  implements Readonly<IGQLTypeDef<Resolver>> {
  static create(inp: IGQLInput | string | DocumentNode) {
    if (isValidInput(inp)) {
      let schema, type;
      if (isIGQLInput(inp)) {
        schema = inp.schema;
        type = inp.type;
      } else if (typeof inp === 'object') {
        schema = inp;
      } else if (typeof inp === 'string') {
        schema = parse(inp);
      }

      if (type) {
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
          default:
            throw new Error('unknown type');
        }
      } else if (schema) {
        const typedef = schema.definitions[0];
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
            } else {
              return new Type(inp);
            }
          }
          default:
            throw new Error('unknown type');
        }
      }
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
  protected _resolver?: Resolver;
  public get resolver(): null | Resolver {
    return this._resolver;
  }
  protected node: DefinitionNode[] | DefinitionNode;
  protected resolveName(schema: string | DocumentNode) {
    const parsed = typeof schema === 'string' ? parse(schema) : schema;
    return (parsed.definitions[0] as TypeDefinitionNode).name.value;
  }
  constructor(args: IGQLInput<Resolver> | string | DocumentNode) {
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
  implements Readonly<IGQLTypeDef<Resolver>> {
  protected resolveName(schema: string | DocumentNode) {
    debugger;
    const parsed = typeof schema === 'string' ? parse(schema) : schema;
    let name;
    visit(parsed, {
      [Kind.FIELD_DEFINITION](node) {
        name = node.name.value;
      },
    });
    return name;
  }
}

export class Query extends Fields<ResolverFunction>
  implements Readonly<IGQLTypeDef<ResolverFunction>> {
  constructor(args: IGQLInput<ResolverFunction> | string | DocumentNode) {
    super(args);
    this._type = ModelType.query;
  }
}

export class Mutation extends Fields<ResolverFunction>
  implements Readonly<IGQLTypeDef<ResolverFunction>> {
  constructor(args: IGQLInput<ResolverFunction> | string | DocumentNode) {
    super(args);
    this._type = ModelType.mutation;
  }
}

export class Type extends GQLType<ResolverFunction | ObjectResolver>
  implements Readonly<IGQLTypeDef<ResolverFunction | ObjectResolver>> {
  constructor(
    args: IGQLInput<ResolverFunction | ObjectResolver> | string | DocumentNode,
  ) {
    super(args);
    this._type = ModelType.type;
  }
}

export class Input extends GQLType<ResolverFunction>
  implements Readonly<IGQLTypeDef<ResolverFunction>> {
  constructor(args: IGQLInput<ResolverFunction> | string | DocumentNode) {
    super(args);
    this._type = ModelType.input;
  }
}

export class Union extends GQLType<UnionInterfaceResolverFunction>
  implements Readonly<IGQLTypeDef<UnionInterfaceResolverFunction>> {
  constructor(
    args: IGQLInput<UnionInterfaceResolverFunction> | string | DocumentNode,
  ) {
    super(args);
    this._type = ModelType.union;
  }
}

export class Interface extends GQLType<UnionInterfaceResolverFunction>
  implements Readonly<IGQLTypeDef<UnionInterfaceResolverFunction>> {
  constructor(
    args: IGQLInput<UnionInterfaceResolverFunction> | string | DocumentNode,
  ) {
    super(args);
    this._type = ModelType.interface;
  }
}

export class Scalar extends GQLType<ScalarResolver>
  implements Readonly<IGQLTypeDef<ScalarResolver>> {
  constructor(args: IGQLInput<ScalarResolver> | string | DocumentNode) {
    super(args);
    this._type = ModelType.scalar;
  }
}

export class Enum extends GQLType
  implements Readonly<IGQLTypeDef<EnumResolver>> {
  public get resolver(): EnumResolver {
    return { [this.name]: this._resolver };
  }
  constructor(args: IGQLInput<EnumResolverInput> | string | DocumentNode) {
    super(args);
    this._type = ModelType.enum;
  }
}
