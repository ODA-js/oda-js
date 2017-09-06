import { RelationBase } from './relationbase';
import { EntityReference } from './entityreference';
import { HasOneStorage, HasOneInput } from './interfaces';
import clean from '../lib/json/clean';

export class HasOne extends RelationBase {
  protected $obj: HasOneStorage;

  get hasOne(): EntityReference {
    return this.$obj.hasOne;
  }

  get ref(): EntityReference {
    return this.$obj.hasOne;
  }

  public updateWith(obj: HasOneInput) {
    if (obj) {
      super.updateWith(obj);
      const result = { ...this.$obj };

      this.setMetadata('storage.single', true);
      this.setMetadata('storage.stored', false);
      this.setMetadata('storage.embedded', false);
      this.setMetadata('verb', 'HasOne');

      let $hasOne = obj.hasOne;
      let hasOne = new EntityReference($hasOne);

      result.hasOne_ = $hasOne;
      result.hasOne = hasOne;

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
      hasOne: props.hasOne ? props.hasOne.toString() : undefined,
    });
  }

  // it get clean object with no default values
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      hasOne: props.hasOne_,
    });
  }
}
