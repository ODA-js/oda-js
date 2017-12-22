import clean from '../lib/json/clean';
import { EntityReference } from './entityreference';
import { BelongsToInput, BelongsToStorage, MetaModelType } from './interfaces';
import { RelationBase } from './relationbase';

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

  constructor(obj: BelongsToInput) {
    super(obj);
  }

  // public validate(pkg?: ModelPackage): IValidationResult[] {
  //   const result: IValidationResult[] = super.validate(pkg);
  //   // if (pkg) {
  //   //   if (!refField.identity) {
  //   //     const update = refField.toJSON();
  //   //     update.identity = true;
  //   //     refField.updateWith(update);
  //   //     result.push({
  //   //       message: 'referenced field for BelongsTo relation is not identity',
  //   //       result: ValidationResultType.fixable,
  //   //     });
  //   //   }

  //   //   // entity
  //   //   if (this.ref.backField) {
  //   //     let bf = entity.fields.get(this.ref.backField);
  //   //     if (!bf) {
  //   //       result.push({
  //   //         message: 'back field not exists. removed.',
  //   //         result: ValidationResultType.fixable,
  //   //       });
  //   //       this.ref.backField = '';
  //   //       bf = field;
  //   //     }
  //   //     if (!bf.indexed) {
  //   //       result.push({
  //   //         message: 'back field is not indexed',
  //   //         result: ValidationResultType.error,
  //   //       });
  //   //       const update = bf.toJSON();
  //   //       update.indexed = true;
  //   //       bf.updateWith(update);
  //   //     }
  //   //     if (bf && bf.identity && typeof bf.identity === 'boolean') {
  //   //       result.push({
  //   //         message: 'back field for BelongsTo relation is identity',
  //   //         result: ValidationResultType.critics,
  //   //       });
  //   //     }
  //   //   } else {
  //   //     if (!field.indexed) {
  //   //       const update = field.toJSON();
  //   //       update.indexed = true;
  //   //       field.updateWith(update);
  //   //       result.push({
  //   //         message: 'field for BelongsTo relation must be indexed',
  //   //         result: ValidationResultType.fixable,
  //   //       });
  //   //     }
  //   //     if (field.identity && typeof field.identity === 'boolean') {
  //   //       result.push({
  //   //         message: 'field for BelongsTo relation is identity',
  //   //         result: ValidationResultType.critics,
  //   //       });
  //   //     }
  //   //   }
  //   // }
  //   return result;
  // }

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
        // no default backField!!! at all!!!
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
