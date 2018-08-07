import { MetaModelType, IObjectType, ObjectTypeStorage, ObjectTypeInput } from './interfaces';
import { EntityBase } from './entitybase';

/**
 * 1. тип объекта который входит на updateWith
 * 2. тип объекта который идет на toObject
 * 3. тип объекта который идет на toJSON
 * 3. тип объекта который идет на выходе clone
 */

export class ObjectType extends EntityBase implements IObjectType {
  public modelType: MetaModelType = 'object-type';
  protected $obj: ObjectTypeStorage;

  constructor(obj: ObjectTypeInput) {
    super(obj);
  }
}
