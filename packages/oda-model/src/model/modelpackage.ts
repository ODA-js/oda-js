import clean from '../lib/json/clean';
import { Entity } from './entity';
import { Field } from './field';
import {
  EntityInput,
  ModelPackageInput,
} from './interfaces';
import { MetaModel } from './metamodel';
import { Mutation } from './mutation';
import { IValidate } from '../validation/interfaces/IValidate';
import { MetaModelType, ModelItem } from '../validation/interfaces/types';
import { IPackage, IPackageProps } from '../validation/interfaces/IPackage';
import { IValidator } from '../validation/interfaces/IValidator';
import { IValidationResult } from '../validation/interfaces/IValidationResult';

// tslint:disable-next-line:no-unused-variable
/** Model package is the storage place of Entities */
export class ModelPackage implements IValidate, IPackage {
  public modelType: 'package';
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
  /** Identity fields cache */
  public identityFields: Map<string, Entity> = new Map();
  /** relation cache */
  public relations: Map<string, Map<string, Field>> = new Map();
  public mutations: Map<string, Mutation> = new Map();

  public items: Map<string, ModelItem>;


  public metaModel: MetaModel;

  public updateWith(obj: Partial<IPackageProps>) {
    return null;
  }

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
