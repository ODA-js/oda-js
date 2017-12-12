import { RelationBase } from './relationbase';
import { EntityReference } from './entityreference';
import { HasManyStorage, HasManyInput } from './interfaces';
import clean from '../lib/json/clean';

export class HasMany extends RelationBase {

  protected $obj: HasManyStorage;

  get hasMany(): EntityReference {
    return this.$obj.hasMany;
  }

  get ref(): EntityReference {
    return this.$obj.hasMany;
  }

  public updateWith(obj: HasManyInput) {
    if (obj) {
      super.updateWith(obj);

      const result = { ...this.$obj };

      this.setMetadata('storage.single', false);
      this.setMetadata('storage.stored', false);
      this.setMetadata('storage.embedded', false);
      this.setMetadata('verb', 'HasMany');

      let $hasMany = obj.hasMany;

      let hasMany;
      if ($hasMany) {
        hasMany = new EntityReference($hasMany);
        if (!hasMany.backField) {
          hasMany.backField = 'id';
        }
      }

      result.hasMany_ = $hasMany;
      result.hasMany = hasMany;

      this.$obj = result;
      this.initNames();
    }
  }
  // it get fixed object
  public toObject(): any {
    let props = this.$obj;
    let res = super.toObject();
    return clean({
      ...res,
      hasMany: props.hasMany ? props.hasMany.toString() : undefined,
    });
  }

  // it get clean object with no default values
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      hasMany: props.hasMany_,
    });
  }
}
