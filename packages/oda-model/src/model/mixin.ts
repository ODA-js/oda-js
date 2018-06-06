import * as inflected from 'inflected';

import clean from '../lib/json/clean';
import deepMerge from './../lib/json/deepMerge';
import { DEFAULT_ID_FIELD } from './definitions';
import { Field } from './field';
import {
  EntityInput, EntityJSON, EntityStorage, FieldInput, IEntity, MetaModelType,
  IMixin, MixinStorage, MixinInput,
} from './interfaces';
import { ModelBase } from './modelbase';
import { ModelPackage } from './modelpackage';
import { EntityBase } from './entitybase';

/**
 * 1. тип объекта который входит на updateWith
 * 2. тип объекта который идет на toObject
 * 3. тип объекта который идет на toJSON
 * 3. тип объекта который идет на выходе clone
 */

export class Mixin extends EntityBase implements IMixin {
  public modelType: MetaModelType = 'mixin';
  protected $obj: MixinStorage;

  constructor(obj: MixinInput) {
    super(obj);
  }
}
