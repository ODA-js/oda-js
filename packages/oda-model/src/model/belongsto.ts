import { RelationBase } from './relationbase';
import { EntityReference } from './entityreference';
import { BelongsToStorage, BelongsToInput } from './interfaces';
import clean from '../lib/json/clean';

/**
 * BelongsTo Relation
 */
export class BelongsTo extends RelationBase {
  protected $obj: BelongsToStorage;

  get belongsTo(): EntityReference {
    return this.$obj.belongsTo;
  }

  /**
   * common for all type Relations
   */
  get ref(): EntityReference {
    return this.$obj.belongsTo;
  }

  /**
   * single point update
   */
  public updateWith(obj: BelongsToInput) {
    if (obj) {
      super.updateWith(obj);

      const result = { ...this.$obj };

      this.setMetadata('storage.single', true);
      this.setMetadata('storage.stored', true);
      this.setMetadata('storage.embedded', true);
      this.setMetadata('verb', 'BelongsTo');

      let $belongsTo = obj.belongsTo;

      let belongsTo;
      if ($belongsTo) {
        belongsTo = new EntityReference($belongsTo);
      }

      result.belongsTo_ = $belongsTo;
      result.belongsTo = belongsTo;

      this.$obj = result;
      this.initNames();
    }
  }

  /**
   * it get fixed object
   */
  public toObject(): any {
    let props = this.$obj;
    let res = super.toObject();
    return clean({
      ...res,
      belongsTo: props.belongsTo ? props.belongsTo.toString() : undefined,
    });
  }

  /**
   * it get clean object with no default values
   */
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      belongsTo: props.belongsTo_,
    });
  }
}
