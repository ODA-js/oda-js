
import clean from '../lib/json/clean';
import { Field } from './field';
import { EntityInput, EntityJSON, EntityStorage, IEntity, MetaModelType } from './interfaces';
import { ModelPackage } from './modelpackage';
import { EntityBase } from './entitybase';

/**
 * 1. тип объекта который входит на updateWith
 * 2. тип объекта который идет на toObject
 * 3. тип объекта который идет на toJSON
 * 3. тип объекта который идет на выходе clone
 */

export class Entity extends EntityBase implements IEntity {
  public modelType: MetaModelType = 'entity';

  protected $obj: EntityStorage;

  constructor(obj: EntityInput) {
    super(obj);
  }

  get implements(): Set<string> {
    return this.$obj.implements;
  }

  public ensureImplementation(modelPackage: ModelPackage) {
    const newFields: Map<string, Field> = new Map<string, Field>();
    this.implements.forEach(intrf => {
      if (modelPackage.mixins.has(intrf)) {
        const impl = modelPackage.mixins.get(intrf);
        impl.fields.forEach(f => {
          if (!this.fields.has(f.name)) {
            newFields.set(f.name, f);
          }
        });
      }
    });

    if (newFields.size > 0) {
      const update = this.toJSON();
      update.fields.push(...[
        ...newFields.values(),
      ].map(f => f.toJSON()));
      this.updateWith(update);
      this.ensureIds(modelPackage);
    }
  }

  public updateWith(obj: EntityInput) {
    if (obj) {
      super.updateWith(obj);

      const result = { ...this.$obj };
      const impl = new Set(obj.implements);

      result.implements = impl;
      this.$obj = result;
    }
  }

  public toObject(modelPackage?: ModelPackage) {
    if (!modelPackage) {
      let res = super.toObject();
      return clean({
        ...res,
        implements: [...this.implements],
      });
    } else {
      let modelRelations = modelPackage.relations.get(this.name);
      if (modelRelations) {
        let res = super.toObject();
        return clean({
          ...res,
          implements: [...this.implements].filter(i => modelPackage.mixins.has(i)),
        });
      }
    }
  }

  public toJSON(modelPackage?: ModelPackage): EntityJSON {
    if (!modelPackage) {
      let res = super.toJSON();
      return clean({
        ...res,
        implements: [...this.implements],
      }) as any;
    } else {
      let modelRelations = modelPackage.relations.get(this.name);
      if (modelRelations) {
        let res = super.toJSON();
        return clean({
          ...res,
          implements: [...this.implements].filter(i => modelPackage.mixins.has(i)),
        });
      }
    }
  }
}
