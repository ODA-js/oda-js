import * as inflected from 'inflected';

import clean from '../lib/json/clean';
import deepMerge from './../lib/json/deepMerge';
import { DEFAULT_ID_FIELD } from './definitions';
import { Field } from './field';
import { EntityInput, EntityJSON, EntityStorage, FieldInput, IEntity, MetaModelType } from './interfaces';
import { ModelBase } from './modelbase';
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
          implements: [...this.implements].filter(i => modelPackage.interfaces.has(i)),
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
          implements: [...this.implements].filter(i => modelPackage.interfaces.has(i)),
        });
      }
    }
  }
}
