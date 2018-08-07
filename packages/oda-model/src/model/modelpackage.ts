import clean from '../lib/json/clean';
import { Entity } from './entity';
import { Field } from './field';
import {
  EntityInput,
  IPackage,
  IValidate,
  IValidationResult,
  IValidator,
  MetaModelType,
  ModelPackageInput,
  IEntityBase,
} from './interfaces';
import { MetaModel } from './metamodel';
import { Mutation } from './mutation';
import { Query } from './query';
import { Mixin } from './mixin';
import { Union } from './union';
import { Enum } from './enum';
import { ObjectType } from './objecttype';
import { Scalar } from './scalar';
import { Directive } from './directive';

// tslint:disable-next-line:no-unused-variable
/** Model package is the storage place of Entities */
export class ModelPackage implements IValidate, IPackage {
  public modelType: MetaModelType = 'package';
  /** name of the package */
  public name: string;
  /** acl level for security sort issues */
  public acl: number;
  /** display title */
  public title?: string;
  /** description */
  public description?: string;
  /** package is diagram */
  public abstract: boolean = false;
  /** entity storage */
  public entities: Map<string, Entity> = new Map();
  public objects: Map<string, ObjectType> = new Map();
  public scalars: Map<string, Scalar> = new Map();
  public directives: Map<string, Directive> = new Map();
  public mixins: Map<string, Mixin> = new Map();
  public unions: Map<string, Union> = new Map();
  public enums: Map<string, Enum> = new Map();
  /** Identity fields cache */
  public identityFields: Map<string, IEntityBase> = new Map();
  /** relation cache */
  public relations: Map<string, Map<string, Field>> = new Map();
  public mutations: Map<string, Mutation> = new Map();
  public queries: Map<string, Query> = new Map();

  public metaModel: MetaModel;

  public validate(validator: IValidator): IValidationResult[] {
    return validator.check(this);
  }

  constructor(name?: string | ModelPackageInput, title?: string, description?: string, acl?: number) {
    if (typeof name === 'string') {
      this.name = name;
      this.title = title || this.name;
      this.description = description || this.name;
      if (typeof acl === 'number') {
        this.acl = acl;
      }
    } else if (!name) {
      this.name = 'DefaultPackage';
      this.acl = Number.MAX_VALUE;
    } else {
      this.name = name.name;
      this.title = name.title;
      this.description = name.description;
      this.abstract = this.abstract || name.abstract;
      if (!this.abstract && typeof name.acl === 'number') {
        this.acl = name.acl;
      }
    }
  }

  public connect(metaModel: MetaModel) {
    this.metaModel = metaModel;
  }

  /** add entity to Package */
  public addEntity(entity: Entity) {
    if (entity instanceof Entity) {
      this.entities.set(entity.name, entity);
      entity.ensureIds(this);
    }
    this.ensureEntity(entity);
    return entity;
  }

  public addMutation(mutation: Mutation) {
    if (mutation instanceof Mutation) {
      this.mutations.set(mutation.name, mutation);
    }
    this.ensureMutation(mutation);
    return mutation;
  }

  public addQuery(query: Query) {
    if (query instanceof Query) {
      this.queries.set(query.name, query);
    }
    this.ensureQuery(query);
    return query;
  }

  public addUnion(uni: Union) {
    if (uni instanceof Union) {
      this.unions.set(uni.name, uni);
    }
    this.ensureUnion(uni);
    return uni;
  }

  public addEnum(enu: Enum) {
    if (enu instanceof Enum) {
      this.enums.set(enu.name, enu);
    }
    this.ensureEnum(enu);
    return enu;
  }

  public addMixin(mix: Mixin) {
    if (mix instanceof Query) {
      this.mixins.set(mix.name, mix);
      // no need to do this
      // intrf.ensureIds(this);
    }
    this.ensureMixin(mix);
    return mix;
  }

  public addScalar(scalar: Scalar) {
    if (scalar instanceof Scalar) {
      this.scalars.set(scalar.name, scalar);
    }
    this.ensureScalar(scalar);
    return scalar;
  }

  public addObjectType (obj: ObjectType) {
    if (obj instanceof Scalar) {
      this.objects.set(obj.name, obj);
    }
    this.ensureObjectType(obj);
    return obj;
  }

  public addDirective(directive: Directive) {
    if (directive instanceof Directive) {
      this.directives.set(directive.name, directive);
    }
    this.ensureDirective(directive);
    return directive;
  }

  /** get Entity by name */
  public get(name: string) {
    return this.entities.get(name);
  }

  /** create entity with json */
  public create(json: EntityInput) {
    return this.addEntity(new Entity(json));
  }

  /**
   * remove entity from package
   */
  public remove(name: string) {
    let entity = this.entities.get(name);
    if (entity) {
      this.entities.delete(name);
      entity.removeIds(this);
    }
  }
  /**
   *  return size of package
   */
  get size(): number {
    return this.entities.size;
  }

  /** ensure all foreign keys */
  public ensureAll() {
    this.entities.forEach((e) => {
      e.ensureImplementation(this);
      e.ensureFKs(this);
    });
  }

  public toJSON(): ModelPackageInput {
    return clean({
      name: this.name,
      title: this.title,
      abstract: this.abstract,
      description: this.description,
      entities: Array.from(this.entities.values()).map(f => f.name),
      mutations: Array.from(this.mutations.values()).map(f => f.name),
      queries: Array.from(this.queries.values()).map(f => f.name),
      enums: Array.from(this.enums.values()).map(f => f.name),
      unions: Array.from(this.unions.values()).map(f => f.name),
      mixins: Array.from(this.mixins.values()).map(f => f.name),
    });
  }

  public toObject(): any {
    return clean({
      name: this.name,
      title: this.title,
      description: this.description,
      abstract: this.abstract,
      entities: Array.from(this.entities.values()).map(f => f.toObject(this)),
      mutations: Array.from(this.mutations.values()).map(f => f.toObject()),
      queries: Array.from(this.queries.values()).map(f => f.toObject()),
      enums: Array.from(this.enums.values()).map(f => f.toObject()),
      unions: Array.from(this.unions.values()).map(f => f.toObject()),
      mixins: Array.from(this.mixins.values()).map(f => f.toObject(this)),
    });
  }

  private ensureEntity(entity) {
    if (!this.metaModel.entities.has(entity.name)) {
      this.metaModel.entities.set(entity.name, entity);
    }
  }

  private ensureMutation(mutation) {
    if (!this.metaModel.mutations.has(mutation.name)) {
      this.metaModel.mutations.set(mutation.name, mutation);
    }
  }

  private ensureQuery(query) {
    if (!this.metaModel.queries.has(query.name)) {
      this.metaModel.queries.set(query.name, query);
    }
  }

  private ensureMixin(mixin) {
    if (!this.metaModel.mixins.has(mixin.name)) {
      this.metaModel.mixins.set(mixin.name, mixin);
    }
  }

  private ensureScalar(scalar) {
    if (!this.metaModel.scalars.has(scalar.name)) {
      this.metaModel.scalars.set(scalar.name, scalar);
    }
  }

  private ensureObjectType(obj) {
    if (!this.metaModel.objects.has(obj.name)) {
      this.metaModel.objects.set(obj.name, obj);
    }
  }

  private ensureDirective(directive) {
    if (!this.metaModel.directives.has(directive.name)) {
      this.metaModel.directives.set(directive.name, directive);
    }
  }

  private ensureUnion(uni) {
    if (!this.metaModel.unions.has(uni.name)) {
      this.metaModel.unions.set(uni.name, uni);
    }
  }

  private ensureEnum(enu) {
    if (!this.metaModel.enums.has(enu.name)) {
      this.metaModel.enums.set(enu.name, enu);
    }
  }
}
