import * as inflected from 'inflected';

import clean from '../lib/json/clean';
import deepMerge from './../lib/json/deepMerge';
import { DEFAULT_ID_FIELD } from './definitions';
import { Field } from './field';
import {
  EntityInput, EntityJSON, EntityStorage, FieldInput, IEntity, MetaModelType,
  IInterface, InterfaceStorage, InterfaceInput,
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

export class Interface extends EntityBase implements IInterface {
  public modelType: MetaModelType = 'interface';
  protected $obj: InterfaceStorage;

  constructor(obj: InterfaceInput) {
    super(obj);
  }
}
