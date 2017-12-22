import { Entity } from './entity';
import { Field } from './field';
// tslint:disable-next-line:no-unused-variable
import {
  ModelPackageInput,
  EntityInput,
  EntityJSON,
  IValidate,
  IValidationResult,
  MetaModelType,
  IPackage,
  IValidator,
} from './interfaces';
import { MetaModel } from './metamodel';
import { Mutation } from './mutation';
import clean from '../lib/json/clean';

/** Model package is the storage place of Entities */
export class ModelPackage implements IValidate , IPackage {
  public modelType: MetaModelType = 'package';
  /** name of the package */
  public name: string;
  /** display title */
  public title?: string;
  /** description */
  public description?: string;
  /** package is diagram */
  public abstract: boolean = false;
  /** entity storage */
  public entities: Map<string, Entity> = new Map();
  /** Identity fields cache */
  public identityFields: Map<string, Entity> = new Map();
  /** relation cache */
  public relations: Map<string, Map<string, Field>> = new Map();
  public mutations: Map<string, Mutation> = new Map();

  public metaModel: MetaModel;

  public validate(validator: IValidator): IValidationResult[] {
    return validator.check(this);
  }

  constructor(name?: string | ModelPackageInput, title?: string, description?: string, parent?: MetaModel) {
    if (typeof name === 'string') {
      this.name = name;
      this.title = title || this.name;
      this.description = description || this.name;
    } else if (!name) {
      this.name = 'DefaultPackage';
    } else {
      this.name = name.name;
      this.title = name.title;
      this.description = name.description;
      this.abstract = this.abstract || name.abstract;
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
    });
  }

  private ensureEntity(entity) {
    if (!this.metaModel.entities.has(entity.name)) {
      this.metaModel.entities.set(entity.name, entity);
    }
  }
  private ensureMutation(entity) {
    if (!this.metaModel.mutations.has(entity.name)) {
      this.metaModel.mutations.set(entity.name, entity);
    }
  }
}
